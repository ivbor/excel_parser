from celery import shared_task
from decouple import config

@shared_task
def process_excel(file_id, excel_type_id):
    from .models import UploadedFile, ExcelType
    from sqlalchemy import create_engine
    from django.db import transaction
    import pandas as pd

    engine = create_engine(
        f"postgresql://{config('POSTGRES_USER')}:{config('POSTGRES_PASSWORD')}" + \
            f"@{config('POSTGRES_HOST')}:5432/{config('POSTGRES_DB')}")

    with transaction.atomic():
        uploaded_file = UploadedFile.objects.select_for_update().get(id=file_id)
        excel_type = ExcelType.objects.get(id=excel_type_id)
        
        # Process the file (simplified logic)
        file_path = uploaded_file.file.path
        
        # For example, read Excel or CSV
        if file_path.lower().endswith('.csv'):
            df = pd.read_csv(file_path, skiprows=excel_type.start_row - 1)
        else:
            df = pd.read_excel(file_path, skiprows=excel_type.start_row - 1, engine='openpyxl')
        
        # Валидация данных
        errors = []
        for column in excel_type.columns:
            col_name = column['name']
            col_type = column['type']

            if col_name not in df.columns:
                errors.append(f"Column '{col_name}' is missing.")
                continue

            if col_type == "int" and not pd.api.types.is_integer_dtype(df[col_name]):
                errors.append(f"Column '{col_name}' should be integer.")
            elif col_type == "float" and not pd.api.types.is_float_dtype(df[col_name]):
                errors.append(f"Column '{col_name}' should be float.")
            elif col_type == "str" and not pd.api.types.is_string_dtype(df[col_name]):
                errors.append(f"Column '{col_name}' should be string.")
            # Add more validations if needed

        if errors:
            uploaded_file.status = 'FAILED'
            uploaded_file.save()
            return {"status": "failed", "errors": errors}

        # Сохраняем данные в таблицу (название таблицы = имя справочника)
        table_name = UploadedFile.__name__.lower().replace(" ", "_")
        df.to_sql(table_name, engine, if_exists='append', index=False)
        uploaded_file.status = 'COMPLETED'
        uploaded_file.save()

        return {"status": "success"}
