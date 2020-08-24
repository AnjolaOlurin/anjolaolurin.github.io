import {Utils} from './utils';

describe('Utils', () => {


    describe('generateRandomNumber', () => {

        it('should generate a unique Random Number every time called', () => {
            expect(Utils.generateRandomNumber(10)).not.toBe(Utils.generateRandomNumber(10));
        });

        it('should generate a Random Number of the given length', () => {
            expect(Utils.generateRandomNumber(10).toString()).toHaveLength(10);
        });
    });

    describe('generateRandomID', () => {

        it('should generate a unique Random ID every time called', () => {
            expect(Utils.generateRandomID(10)).not.toBe(Utils.generateRandomID(10));
        });

        it('should generate a Random ID of the given length', () => {
            expect(Utils.generateRandomID(10)).toHaveLength(10);
        });
    });


    describe('toSlug', () => {

        it('should create a slug out of given string', () => {
            expect(Utils.toSlug('a simple text')).toBe('a-simple-text');
        });

    });

    describe('toSentenceCase', () => {

        it('should transform a given string to title case', () => {
            expect(Utils.toSentenceCase('a simple text')).toBe('A simple text');
        });

    });

    describe('removeNilValues', () => {

        it('should remove nil values from a giving object', () => {
            const obj = {a: null, b: undefined, c: true, d: false, e: 'Hello', f: {}};
            const removedObj = Utils.removeNilValues(obj);
            expect(removedObj).not.toHaveProperty('a');
            expect(removedObj).not.toHaveProperty('b');
            expect(removedObj).toHaveProperty('c');
            expect(removedObj).toHaveProperty('d');
            expect(removedObj).toHaveProperty('e');
            expect(removedObj).toHaveProperty('f');
        });

    });


    describe('selectKeys', () => {

        it('should select a space separated keys from an object', () => {
            const obj = {a: 'Hello', b: 'World', c: '!'};
            const stripedObj = Utils.selectKeys(obj, 'a c');
            expect(stripedObj).toHaveProperty('a');
            expect(stripedObj).not.toHaveProperty('b');
            expect(stripedObj).toHaveProperty('c');
        });

    });

    describe('pickKeys', () => {

        it('should deep select a space separated keys from an object', () => {
            const obj = {a: 'Hello', b: 'World', c: {name: 'welcome', 'text': 'Welcome'}};
            const stripedObj = Utils.pickKeys(obj, 'a b c.name');
            expect(stripedObj).toHaveProperty('a');
            expect(stripedObj).toHaveProperty('b');
            expect(stripedObj).toHaveProperty('c');
            expect(stripedObj.c).toHaveProperty('name');
            expect(stripedObj.c).not.toHaveProperty('text');
        });

    });


});
