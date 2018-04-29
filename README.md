# SketchBoard

SketchBoard is the project for team20, 2018 spring, CMU course 17-637 WebApp development.

This is a real-time collaboration tool. It's like google slides, which makes you work with teammates
together, but allows you to do scribbles too!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Django 1.11(not sure if a higher version is compatible)

Python 3.5+

pip

pusher.js

p5.js

flora.js

### Installing

First, make sure you have python 3.5+ on your laptop. And then install pip.

My system is windows 10, and this tutorial works for windows. Installing on Linux are basically same as this one.

Install Django 1.11

```
pip install Django==1.11
```

Follow the documentation to create a virtual enviroment. See here: 

https://docs.djangoproject.com/en/1.11/intro/install/

After that, activate on your virenv.

```
cd <the folder for this project>

workon <your virenv name>
```

For example, your virtual enviroment has a name "myproject", the folder is team20, then:

```
cd team20

workon myproject
```

Then install pusher.js:

```
pip install pusher

```

Then download p5.js if you like. Or you can get the resource from their website directly by inserting a snippet of code and this is what we did for this project.

Same for the flora.js.

## Running the project

Now you are in the folser for this project, then:

```
python manage.py makemigrations

python manage.py migrate

python manage.py runserver

```

Then, go to your browser and type "localhost:8000" to visit the project site.

To stop this, go to your console and press Ctl + C (or Ctl + some other keys).

## Deployment

To deploy this on cloud, you can choose Amozon EC2, which is used by our team, or Heroku. Search the guidance and deploy it.

## Built With

* [Django](https://www.djangoproject.com/) - The web framework used
* [pusher](https://pusher.com/) - Websocket management
* [Bootstrap](https://getbootstrap.com/) - UI management
* [p5.js](https://p5js.org/) - Scribble functions
* [Froala editor](https://www.froala.com/wysiwyg-editor) - Textbox and sticky notes functions
* [EC2](https://aws.amazon.com/ec2/) - Deployment management

## Authors

* **Seonwoo Park** - *User register/login/logout; canvas settings and functions design; UI & UX design* - [Sunny Park](https://github.com/sunny-sunwoo)

* **Yichen Zheng** - *Textbox functions; sticky notes functions; inviting co-workers functions; profile management* - [yichencoding](https://github.com/yichencoding)

* **Zihao Wang** - *Scribble functions; real-time collaboration implement; security issues; canvas management functions; inviting co-workers functions; cloud deployment* - [Hot Pot Bubble](https://github.com/zihaowangcmu)

## Acknowledgments

* This is project for CMU 17-637. Thank you Jeff! And I am su lucky to have you two as best teammates and friends!

