import {EventEmitter} from 'eventemitter3';

export default class Globals {
    constructor() {
        this._baseUrl = 'https://jsonplaceholder.typicode.com';
        this._eventEmitter = new EventEmitter();
    }

    static instance() { // singletone
        if (this._instance === undefined) {
            this._instance = new Globals();
        }

        return this._instance;
    }

    static showLoadingIndicator() {
        Globals.instance().eventEmitter.emit('show-loading-indicator');
    }

    static hideLoadingIndicator() {
        Globals.instance().eventEmitter.emit('hide-loading-indicator');
    }

    // below is getters and setters
    get baseUrl() {
        return this._baseUrl;
    }
    set baseUrl(value) {
        this._baseUrl = value;
    }

    get eventEmitter() {
        return this._eventEmitter;
    }


}
