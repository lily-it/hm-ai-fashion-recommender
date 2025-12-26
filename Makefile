# Makefile

.PHONY: all frontend backend build up down

all: build

frontend:
	docker build -t hm-frontend ./frontend

backend:
	docker build -t hm-backend ./backend

build: frontend backend

up:
	docker-compose up --build

down:
	docker-compose down