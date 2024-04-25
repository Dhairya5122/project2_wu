// Import required modules
const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

// // Test the registration route
// describe('Testing Registration Route', () => {
//   it('should get the registration route', async () => {
//     const response = await request(app).get('/registration');
//     expect(response.status).toBe(200);
//     expect(response.text).toBe('Registration Route');
//   });
// });

// Test the login page route
describe('Testing Login Page Route', () => {
  it('should get the login page', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(200);
  });
});

// // Test the service worker
// describe('Testing Service Worker', () => {
//   it('should load the service worker', async () => {
//     const response = await request(app).get('/sw.js');
//     // expect(response.status).toBe(200);
//     expect(response.headers['content-type']).toBe('application/javascript; charset=UTF-8');
//     const swContent = fs.readFileSync(path.join(__dirname, "../views/front/sw.js"), "utf-8");
//     expect(response.text).toEqual(swContent);
//   });
// });