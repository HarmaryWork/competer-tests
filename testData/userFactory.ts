import {faker} from '@faker-js/faker';
import RandExp from 'randexp';

const generateUserData = () => {
    return {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        phone: new RandExp(/^[\+][0-9][\(][0-9]{3}[\)][0-9]{3}?[\-]?[0-9]{2}?[\-]?[0-9]{2}/).gen(),
        password: faker.internet.password()
    };
};

export default generateUserData;