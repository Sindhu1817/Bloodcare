from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector
import traceback

app = Flask(__name__)
CORS(app)

app.secret_key = "supersecretkey"


# ===============================
# DATABASE CONNECTION
# ===============================

def get_db():

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_PASSWORD",
        database="blood_bank"
    )

    return conn


# ===============================
# CREATE TABLE
# ===============================

def init_db():

    db = get_db()

    cursor = db.cursor()

    cursor.execute("""

        CREATE TABLE IF NOT EXISTS donors (

            id INT AUTO_INCREMENT PRIMARY KEY,

            name VARCHAR(100),

            age INT,

            gender VARCHAR(20),

            blood_group VARCHAR(10),

            contact VARCHAR(20) UNIQUE,

            email VARCHAR(100) UNIQUE,

            country VARCHAR(50),

            state VARCHAR(50),

            city VARCHAR(50)

        )

    """)

    db.commit()

    db.close()


# Initialize DB

try:

    init_db()

    print("✅ Database initialized successfully")

except Exception as e:

    print("❌ Database init error:", e)


# ===============================
# PAGE ROUTES
# ===============================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/donors-page")
def donors():

    # FIXED FILE NAME

    return render_template("donor.html")


@app.route("/about")
def about():
    return render_template("about.html")


# ===============================
# REGISTER DONOR API
# ===============================

@app.route("/register_donor", methods=["POST"])
def register_donor():

    db = get_db()

    cursor = db.cursor(dictionary=True)

    try:

        data = request.get_json()

        print("Incoming Data:", data)


        # ===============================
        # CHECK EMAIL
        # ===============================

        cursor.execute(
            "SELECT * FROM donors WHERE email=%s",
            (data["email"],)
        )

        if cursor.fetchone():

            return jsonify({
                "message": "❌ Email already exists"
            }), 400


        # ===============================
        # CHECK CONTACT
        # ===============================

        cursor.execute(
            "SELECT * FROM donors WHERE contact=%s",
            (data["contact"],)
        )

        if cursor.fetchone():

            return jsonify({
                "message": "❌ Contact already exists"
            }), 400


        # ===============================
        # INSERT DONOR
        # ===============================

        query = """

            INSERT INTO donors
            (
                name,
                age,
                gender,
                blood_group,
                contact,
                email,
                country,
                state,
                city
            )

            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)

        """

        values = (

            data["name"],
            data["age"],
            data["gender"],
            data["blood_group"],
            data["contact"],
            data["email"],
            "India",
            data["state"],
            data["city"]

        )

        cursor.execute(query, values)

        db.commit()

        return jsonify({
            "message": "❤️ You are now someone's hero!"
        }), 201


    except Exception as e:

        print("\n❌ REGISTER ERROR ❌")
        traceback.print_exc()

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        db.close()


# ===============================
# SEARCH DONORS API
# ===============================

@app.route("/search_donors", methods=["POST"])
def search_donors():

    db = get_db()

    cursor = db.cursor(dictionary=True)

    try:

        data = request.get_json()

        print("Search Data:", data)

        if not data:

            return jsonify([])


        blood = data.get("blood")
        state = data.get("state")
        city = data.get("city")


        if not blood or not state or not city:

            return jsonify([])


        query = """

            SELECT
                id,
                name,
                age,
                gender,
                blood_group,
                contact,
                email,
                state,
                city

            FROM donors

            WHERE blood_group = %s
            AND state = %s
            AND city = %s

            ORDER BY id DESC

        """

        cursor.execute(

            query,

            (
                blood.strip(),
                state.strip(),
                city.strip()
            )

        )

        donors = cursor.fetchall()

        return jsonify(donors)


    except Exception as e:

        print("\n❌ SEARCH ERROR ❌")
        traceback.print_exc()

        return jsonify([])


    finally:

        db.close()


# ===============================
# RUN APP
# ===============================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
