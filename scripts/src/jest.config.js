module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    // the "ts" option is important, as otherwise jest tries to find .js files from the imports
    // also make sure "ts" comes before "js"
    // it tries to find ts files from imports first, then js files if not found
    "moduleFileExtensions": [
        "ts",
        "js"
    ]
}