from api.db import cursor

def get_owner_mobile(plate):

    cursor.execute(
        "SELECT mobile FROM vehicle_owners WHERE plate_number = %s",
        (plate,)
    )

    result = cursor.fetchone()

    return result[0] if result else None