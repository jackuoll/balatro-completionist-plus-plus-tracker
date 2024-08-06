# Balatro Completionist++ Tracker

## Overview

This application helps you track your progress towards the hardest Balatro achievement, **Completionist++**.

Basically, you can manage and track your gold stickers on a web page. The features include viewing all jokers, adding or removing gold stickers for a specific joker or all jokers, and filtering jokers based on their gold sticker status. Additionally, you can see the total number and percentage of jokers with gold stickers.

Your progress is stored in a **SQLite** database. The backend is built using **Flask**, while the web page functionalities are handled by **JavaScript**.


## Installation and running

### Default way:
#### Linux/MacOS:

```bash
# using shell
git clone https://github.com/blackfan321/balatro-completionist-plus-plus-tracker.git
cd balatro-completionist-plus-plus-tracker
chmod +x run.sh && ./run.sh

# or just click Code -> Download ZIP. Unpack the archive and execute run.sh script
```

#### Windows:
```shell
# using cmd
git clone https://github.com/blackfan321/balatro-completionist-plus-plus-tracker.git
cd balatro-completionist-plus-plus-tracker
run.bat

# or just click Code -> Download ZIP. Unpack the archive and execute run.bat script
```
### Docker way:

```bash
git clone https://github.com/blackfan321/balatro-completionist-plus-plus-tracker.git
cd balatro-completionist-plus-plus-tracker
docker compose up -d

# sqlite volume will be in folder "data" in the current directory
```


## Usage
Just open https://localhost:5000 in your browser. I tested the application in a chromium-based browser and Safari, not sure about how it works in Firefox.
