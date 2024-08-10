import os
import sqlite3


def init_db():
    data_path = os.path.join(os.path.dirname(__file__), 'data')
    db_path = os.path.join(data_path, 'app.db')
    os.makedirs(data_path, exist_ok=True)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
                   SELECT name 
                     FROM sqlite_master 
                    WHERE type='table' 
                      AND name='jokers'
                   ''')
    talbe_exists = cursor.fetchone()

    if not talbe_exists:
        cursor.execute('''
                       CREATE TABLE jokers (
                            name TEXT PRIMARY KEY,
                            status TEXT
                      )''')

    conn.commit()
    conn.close()


def init_jokers():
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    cursor = conn.cursor()

    jokers = ('8 Ball', 'Abstract Joker', 'Acrobat', 'Ancient Joker', 'Arrowhead', 'Astronomer', 'Banner', 'Baron',
              'Baseball Card', 'Blackboard', 'Bloodstone', 'Blue Joker', 'Blueprint', 'Bootstraps', 'Brainstorm',
              'Bull', 'Burglar', 'Burnt Joker', 'Business Card', 'Campfire', 'Canio', 'Card Sharp', 'Cartomancer',
              'Castle', 'Cavendish', 'Ceremonial Dagger', 'Certificate', 'Chaos the Clown', 'Chicot', 'Clever Joker',
              'Cloud 9', 'Constellation', 'Crafty Joker', 'Crazy Joker', 'Credit Card', 'Delayed Gratification',
              'Devious Joker', 'Diet Cola', 'DNA', "Driver's License", 'Droll Joker', 'Drunkard', 'Dusk', 'Egg',
              'Erosion', 'Even Steven', 'Faceless Joker', 'Fibonacci', 'Flash Card', 'Flower Pot', 'Fortune Teller',
              'Four Fingers', 'Gift Card', 'Glass Joker', 'Gluttonous Joker', 'Golden Joker', 'Golden Ticket',
              'Greedy Joker', 'Green Joker', 'Gros Michel', 'Hack', 'Half Joker', 'Hallucination', 'Hanging Chad',
              'Hiker', 'Hit the Road', 'Hologram', 'Ice Cream', 'Invisible Joker', 'Joker', 'Joker Stencil',
              'Jolly Joker', 'Juggler', 'Loyalty Card', 'Luchador', 'Lucky Cat', 'Lusty Joker', 'Mad Joker', 'Madness',
              'Mail-In Rebate', 'Marble Joker', 'Matador', 'Merry Andy', 'Midas Mask', 'Mime', 'Misprint', 'Mr. Bones',
              'Mystic Summit', 'Obelisk', 'Odd Todd', 'Onyx Agate', 'Oops! All 6s', 'Pareidolia', 'Perkeo',
              'Photograph', 'Popcorn', 'Raised Fist', 'Ramen', 'Red Card', 'Reserved Parking', 'Ride the Bus',
              'Riff-Raff', 'Rocket', 'Rough Gem', 'Runner', 'Satellite', 'Scary Face', 'Scholar', 'Séance',
              'Seeing Double', 'Seltzer', 'Shoot the Moon', 'Shortcut', 'Showman', 'Sixth Sense', 'Sly Joker',
              'Smeared Joker', 'Smiley Face', 'Sock and Buskin', 'Space Joker', 'Spare Trousers', 'Splash',
              'Square Joker', 'Steel Joker', 'Stone Joker', 'Stuntman', 'Supernova', 'Superposition', 'Swashbuckler',
              'The Duo', 'The Family', 'The Idol', 'The Order', 'The Tribe', 'The Trio', 'Throwback', 'To Do List',
              'To the Moon', 'Trading Card', 'Triboulet', 'Troubadour', 'Turtle Bean', 'Vagabond', 'Vampire',
              'Walkie Talkie', 'Wee Joker', 'Wily Joker', 'Wrathful Joker', 'Yorick', 'Zany Joker')

    for joker in jokers:
        query = f"""
            INSERT OR IGNORE into jokers (name, status) 
            VALUES ("{joker}", 'no gold sticker')
        """
        cursor.execute(query)

    conn.commit()
    conn.close()


def get_all_jokers():
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    query = f"""
        SELECT *
        FROM jokers
    """

    cursor.execute(query)
    jokers = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jokers


def update_joker_status(joker_name: str, status: str):
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    cursor = conn.cursor()

    query = """
        UPDATE jokers
        SET status = :status
        WHERE name = :joker_name
    """

    cursor.execute(query, {"joker_name": joker_name,
                           "status": status})

    conn.commit()
    conn.close()


def check_if_db_empty() -> bool:
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM jokers")
    count = cursor.fetchone()[0]

    conn.close()

    if count == 0:
        return True
    else:
        return False


def get_jokers_by_status(status: str):
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    query = f"""
        SELECT *
        FROM jokers
        WHERE status = '{status}'
    """

    cursor.execute(query)
    jokers = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jokers


def change_all_jokers_status(status: str):
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'data', 'app.db'))
    cursor = conn.cursor()

    query = f"""
        UPDATE jokers 
        SET status = '{status}'
    """

    cursor.execute(query)

    conn.commit()
    conn.close()
