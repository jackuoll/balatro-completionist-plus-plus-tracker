from sys import stderr

from flask import Flask, render_template, request, jsonify
from loguru import logger

from db import init_db, init_jokers, get_all_jokers, update_joker_status, check_if_db_empty, change_all_jokers_status

app = Flask(__name__)

logger.remove()
frmt = "<green>{time:DD-MM-YYYY HH:mm:ss}</green> | <level>{level: <8}</level> | " \
       "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
logger.add(stderr, format=frmt)
logger.info("Loguru started.")


@app.route('/')
def index():
    jokers = get_all_jokers()

    gold_sticker_count = sum(1 for joker in jokers if joker['status'] == 'gold sticker')

    rounded_percentage = round(((gold_sticker_count * 100) / 150), 2)
    rounded_percentage_formatted = f"{rounded_percentage:.2f}"

    return render_template('index.html',
                           jokers=jokers,
                           sticker_count=gold_sticker_count,
                           sticker_percentage=rounded_percentage_formatted)


@app.route('/change_joker_status', methods=['POST'])
def change_joker_status():
    data = request.get_json()
    joker_name, status = data.get('joker_name'), data.get('status')

    if not joker_name or status not in ['gold sticker', 'no gold sticker']:
        logger.error(f'Invalid input from page with data: {data}')
        return jsonify({'error': 'Invalid input'}), 400

    try:
        update_joker_status(joker_name=joker_name, status=status)
    except Exception as e:
        logger.error(f'Failed to change joker "{joker_name}" status with data: {data}. {e}')
        return jsonify({'error': 'Failed to update joker status'}), 500
    else:
        logger.info(f'Successfully updated joker "{joker_name}" status to "{status}"')
        return jsonify({'status': 'ok'}), 200


@app.route('/remove_all_gold_stickers', methods=['POST'])
def remove_all_gold_stickers():
    try:
        change_all_jokers_status(status='no gold sticker')
    except Exception as e:
        logger.error(f'Failed to remove all stickers from jokers. {e}')
        return jsonify({'error': 'Failed to update joker status'}), 500
    else:
        logger.info(f'Successfully removed all stickers from jokers')
        return jsonify({'status': 'ok'}), 200


@app.route('/add_all_gold_stickers', methods=['POST'])
def add_all_gold_stickers():
    try:
        change_all_jokers_status(status='gold sticker')
    except Exception as e:
        logger.error(f'Failed to add gold stickers to all jokers. {e}')
        return jsonify({'error': 'Failed to add gold stickers to all jokers'}), 500
    else:
        logger.info(f'Successfully added gold stickers to all jokers')
        return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    init_db()
    if check_if_db_empty():
        logger.info('DB is empty, filling up')
        init_jokers()

    app.run()
