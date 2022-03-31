const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
	{
		id: 'p1',
		name: 'Evgeniy Budaev',
		email: 'test@test.com',
		password: 'testers',
	}
];

const getUsers = (req, res, next) => {
	res.status(200).json({
		users: DUMMY_PLACES
	});
};

const signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError(
			'Invalid inputs passed, please check your data.', 422
		);
	}

	const { name, email, password } = req.body;
	const hasUser = DUMMY_PLACES.find(user => user.email === email);

	if (hasUser) {
		throw new HttpError('Could not create user,email already exists', 422);
	}

	const createdUser = {
		id: uuid(),
		name,
		email,
		password
	};

	DUMMY_PLACES.push(createdUser);

	res.status(201).json({
		user: createdUser
	});
};

const login = (req, res, next) => {
	const { email, password } = req.body;

	const identifiedUser = DUMMY_PLACES.find(
		user => user.email === email && user.password === password
	);

	if (!identifiedUser || identifiedUser.password !== password) {
		throw new HttpError(
			'Could not identify user, please check your credentials', 401
		);
	}

	res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
