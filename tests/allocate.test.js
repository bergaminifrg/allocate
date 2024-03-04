
const { allocate } = require('../src/allocate');

test('allocate function works as expected', () => {
    const salesOrders = [
        { 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 },
        { 'id': 'S2', 'created': '2020-11-05', 'quantity': 2 },
        { 'id': 'S3', 'created': '2019-12-04', 'quantity': 3 },
        { 'id': 'S4', 'created': '2020-01-20', 'quantity': 2 },
        { 'id': 'S5', 'created': '2019-12-15', 'quantity': 9 },
    ];

    const purchaseOrders = [
        { 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 4 },
        { 'id': 'P2', 'receiving': '2020-01-05', 'quantity': 3 },
        { 'id': 'P3', 'receiving': '2020-02-01', 'quantity': 5 },
        { 'id': 'P4', 'receiving': '2020-03-05', 'quantity': 1 },
        { 'id': 'P5', 'receiving': '2020-02-20', 'quantity': 7 },
    ];

    const result = allocate(salesOrders, purchaseOrders);

    expect(result).toEqual([
        { id: 'S3', date: '2020-01-11' },
        { id: 'S5', date: '2020-02-08' },
        { id: 'S1', date: '2020-02-27' },
        { id: 'S4', date: '2020-03-12' },
    ]);
});

test('allocate function returns empty array without inputs', () => {
    const salesOrders = [];
    const purchaseOrders = [];

    const result = allocate(salesOrders, purchaseOrders);

    expect(result).toEqual([]);
});


test('allocate function works with a single sale and purchase', () => {
    const salesOrders = [{ 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 }];
    const purchaseOrders = [{ 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 10 }];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([{ id: 'S1', date: '2020-01-11' }]);
});

test('allocate function works with multiple sales and a single purchase', () => {
    const salesOrders = [
        { 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 },
        { 'id': 'S2', 'created': '2020-01-05', 'quantity': 2 },
    ];
    const purchaseOrders = [{ 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 8 }];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([
        { id: 'S1', date: '2020-01-11' },
        { id: 'S2', date: '2020-01-11' },
    ]);
});

test('allocate function works with multiple purchases and a single sale', () => {
    const salesOrders = [{ 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 }];
    const purchaseOrders = [
        { 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 4 },
        { 'id': 'P2', 'receiving': '2020-01-06', 'quantity': 4 },
    ];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([{ id: 'S1', date: '2020-01-13' }]);
});

test('allocate function handles excess inventory', () => {
    const salesOrders = [{ 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 }];
    const purchaseOrders = [
        { 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 8 },
        { 'id': 'P2', 'receiving': '2020-01-06', 'quantity': 4 },
    ];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([{ id: 'S1', date: '2020-01-11' }]);
});

test('allocate function works with different date formats', () => {
    const salesOrders = [{ 'id': 'S1', 'created': '2020-01-02', 'quantity': 6 }];
    const purchaseOrders = [
        { 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 4 },
        { 'id': 'P2', 'receiving': '2020-01-06T10:30:00', 'quantity': 4 },
    ];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([{ id: 'S1', date: '2020-01-13' }]);
});

test('allocate function returns an empty array when there is no inventory', () => {
    const salesOrders = [{ 'id': 'S1', 'created': '2020-01-02', 'quantity': 3 }];
    const purchaseOrders = [{ 'id': 'P1', 'receiving': '2020-01-04', 'quantity': 2 }];
    const result = allocate(salesOrders, purchaseOrders);
    expect(result).toEqual([]);
});