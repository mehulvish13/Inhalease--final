const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const files = {
    users: 'users.json',
    aqi: 'aqi.json',
    predictions: 'predictions.json'
};

const ensureDataDir = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

const ensureFile = (fileName, defaultValue) => {
    ensureDataDir();
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    }
    return filePath;
};

const writeJson = (fileName, data) => {
    const filePath = ensureFile(fileName, []);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const readJson = (fileName, defaultValue) => {
    const filePath = ensureFile(fileName, defaultValue);
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        if (!raw.trim()) {
            writeJson(fileName, defaultValue);
            return defaultValue;
        }
        return JSON.parse(raw);
    } catch (error) {
        writeJson(fileName, defaultValue);
        return defaultValue;
    }
};

const generateId = () => {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const getUsers = () => readJson(files.users, []);
const saveUsers = (users) => writeJson(files.users, users);

const findUserByEmail = (email) => {
    const users = getUsers();
    const normalized = normalizeEmail(email);
    return users.find((user) => normalizeEmail(user.email) === normalized);
};

const findUserById = (id) => {
    const users = getUsers();
    return users.find((user) => user._id === id);
};

const createUser = (userData) => {
    const users = getUsers();
    const now = new Date().toISOString();
    const user = {
        _id: generateId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: normalizeEmail(userData.email),
        password: userData.password,
        location: userData.location || {},
        createdAt: now
    };
    users.push(user);
    saveUsers(users);
    return user;
};

const updateUser = (id, updates) => {
    const users = getUsers();
    const index = users.findIndex((user) => user._id === id);
    if (index === -1) {
        return null;
    }
    const updatedUser = {
        ...users[index],
        ...updates
    };
    users[index] = updatedUser;
    saveUsers(users);
    return updatedUser;
};

const getAqiRecords = () => readJson(files.aqi, []);
const saveAqiRecords = (records) => writeJson(files.aqi, records);

const createAqiRecord = (recordData) => {
    const records = getAqiRecords();
    const record = {
        _id: generateId(),
        user: recordData.user,
        location: recordData.location || {},
        aqi: recordData.aqi,
        pm25: recordData.pm25,
        pm10: recordData.pm10,
        recordedAt: new Date().toISOString()
    };
    records.push(record);
    saveAqiRecords(records);
    return record;
};

const listAqiByUser = (userId, limit = 10) => {
    const records = getAqiRecords()
        .filter((record) => record.user === userId)
        .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    return records.slice(0, limit);
};

const getPredictions = () => readJson(files.predictions, []);
const savePredictions = (predictions) => writeJson(files.predictions, predictions);

const createPrediction = (predictionData) => {
    const predictions = getPredictions();
    const prediction = {
        _id: generateId(),
        location: predictionData.location || {},
        predictedAqi: predictionData.predictedAqi,
        forecastDate: predictionData.forecastDate,
        createdAt: new Date().toISOString()
    };
    predictions.push(prediction);
    savePredictions(predictions);
    return prediction;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    createAqiRecord,
    listAqiByUser,
    createPrediction
};
