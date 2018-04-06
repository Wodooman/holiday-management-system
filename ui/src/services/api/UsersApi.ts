import User from '../../models/User';
import UserContract from './contracts/UserContract';

export default class UserApi {

    getAllUsers(): Promise<Array<User>> {
        return new Promise((resolve, reject) => {
            fetch('/api/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing UserService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    resolve(data.map((entry: UserContract) => {
                        return new User(entry.id, entry.firstName, entry.lastName, entry.email, entry.accountName);
                    }));
                })
                .catch(reject);
        });
    }

    getUser(id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            fetch(`/api/users/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing UserService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    resolve(new User(data.id, data.firstName, data.lastName, data.email, data.accountName));
                })
                .catch(reject);
        });
    }

    registerUser(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error while accessing UserService. Details: (${response.status})${response.statusText}`);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                resolve(new User(data.id, data.firstName, data.lastName, data.email, data.accountName));
            })
            .catch(reject);
        });
    }

    clone(value: object) {
        return JSON.parse(JSON.stringify(value));
    }
}