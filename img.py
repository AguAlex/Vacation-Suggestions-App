import psycopg2
import random

# Lista cu link-uri de imagini
imagini = [
    "https://cf.bstatic.com/xdata/images/hotel/max500/673007858.jpg?k=c5432e69beacb63882c1b10e3700a73af48516db47277777d5e13cd9e0523db9&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max500/673003970.jpg?k=f893448d1cea448f6ee919956ec6995cc5c80eec6da827f39b8e4aacaa0ffe5d&o=",
    "https://hello-hotels-bucuresti.continentalhotels.ro/wp-content/uploads/sites/9/2021/02/Hello-Hotels_Hello-zi-.jpg",
    "https://digital.ihg.com/is/image/ihg/even-hotels-belgrade-10092009617-4x3",
    "https://costar.brightspotcdn.com/dims4/default/f5408af/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F73%2Fd9%2F4c27902242238bd0d2ea7fa2fcbd%2F20230725-india-grandhyattmumbai.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/673003966.jpg?k=fbc7f882f5339d1d14b45de4f1fa7d6360b956a38089cf4b19ed3d70c6094b97&o=&hp=1",
    "https://static-new.lhw.com/HotelImages/Final/LW0430/lw0430_177729896_720x450.jpg",
    "https://image-tc.galaxy.tf/wijpeg-3qlacfbbtytlwdh6labgnjaku/poza-crowne_standard.jpg?crop=0%2C0%2C2000%2C1500",
    "https://media.expedia.com/media/content/shared/images/travelguides/sem-hotels-tablet.jpg?impolicy=fcrop&w=450&h=280&q=medium",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ2oJr8oZY0uNl5esuMyJSXHOLlFXaNeL5fw&s",
    "https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/17785665.jpg?k=041f4a65899a2392ae90833c850322b76a4c81e9fdc1195e68f4e4cc839dce1e&o=&hp=1",
    "https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720?fit=crop,1&wid=1440&hei=720",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKG8EeefSWO3bbag1dLCJWubyd5pba3Da4Gg&s",
    "https://images.prestigeonline.com/wp-content/uploads/sites/5/2024/04/10221200/431313100_17874505356049139_5206131842345222780_n-1-1.jpeg",
    "https://www.firmdalehotels.com/media/stnf0fj0/240402_f_csh_rm110_293_preview_.jpg?anchor=center&mode=crop&quality=-1&width=1596&height=892&bgcolor=fff&rnd=133584318139600000&sig=105c5cfa4a346715796e825085ac0f30",
    "https://europa-hotel-eforie-nord.hotelmix.ro/data/Photos/OriginalPhoto/15669/1566923/1566923693/Ana-Hotels-Europa-Eforie-Nord-Exterior.JPEG",
    "https://hello-hotels-bucuresti.continentalhotels.ro/wp-content/uploads/sites/9/2025/04/0000s_0046_Conti-Hello129.jpg",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/7a/bd/4d/caption.jpg?w=1200&h=-1&s=1",
    "https://media-cdn.tripadvisor.com/media/photo-s/2c/b0/c1/4c/boutique-hotels.jpg",
    "https://hello-hotels-bucuresti.continentalhotels.ro/wp-content/uploads/sites/9/2021/02/Hello-Hotels-intrare_2.jpg",
    "https://www.sovereign.com/-/media/Bynder/Sovereign-collections/Hotels-With-Private-Pools/116949_Signature-Pool-Water-Villa_001-Hybris.jpg?rev=e4a6fcef479546a7a7b87391a6464d98&hash=8EA2654A9063CFB1DBF9FF3C96AD03C0&w=1920&h=940",
    "https://cdn-ijnhp.nitrocdn.com/pywIAllcUPgoWDXtkiXtBgvTOSromKIg/assets/images/optimized/rev-5794eaa/www.jaypeehotels.com/blog/wp-content/uploads/2024/09/Blog-4-scaled.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/485599337.jpg?k=7bc2078d7a0f5949b91651a80225e3585322f7928290f35919f59c372d575dd7&o=&hp=1"
]

# Conectare la baza de date PostgreSQL (folosind URL-ul dat)
conn = psycopg2.connect(
    dbname="neondb",
    user="neondb_owner",
    password="npg_StYVO2uKad6Q",
    host="ep-bold-thunder-a2v1armx-pooler.eu-central-1.aws.neon.tech",
    sslmode="require"
)

cursor = conn.cursor()

# Selectăm toate hotelurile care nu au imagine
cursor.execute("SELECT id FROM accomodations")
rows = cursor.fetchall()

# Atribuim fiecărui hotel o imagine aleatoare
for (hotel_id,) in rows:
    imagine_link = random.choice(imagini)
    cursor.execute(
        "UPDATE accomodations SET imagine = %s WHERE id = %s",
        (imagine_link, hotel_id)
    )

# Commit și închidere conexiune
conn.commit()
cursor.close()
conn.close()

print("Actualizare completă cu imagini random.")
