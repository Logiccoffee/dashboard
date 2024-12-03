import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";

        // Array to store orders data
        let orders = [];

        // Get token from cookies
        const token = getCookie('login');
        if (!token) {
            alert('Token tidak ditemukan, harap login terlebih dahulu!');
            throw new Error("Token tidak ditemukan. Harap login ulang.");
        }

        // Fetch orders from the API using getJSON
        getJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/order', "Login", token, (response) => {
            if (response.status === 200) {
                orders = response.data.data || []; // Store the fetched order data
                displayOrders();
            } else {
                console.error(`Error: ${response.status}`);
                alert("Gagal memuat data pesanan. Silakan coba lagi.");
            }
        });

        // Display orders in the table
        function displayOrders() {
            const container = document.getElementById('order-list');

            if (!container) {
                console.error("Elemen dengan id 'order-list' tidak ditemukan.");
                return;
            }

            container.innerHTML = ''; // Clear any existing data

            orders.forEach((item) => {
                const row = document.createElement('tr');

                const orderNameCell = document.createElement('td');
                orderNameCell.textContent = item.name;

                const statusCell = document.createElement('td');
                statusCell.textContent = item.status;

                const actionCell = document.createElement('td');
                actionCell.classList.add('text-center');

                row.appendChild(orderNameCell);
                row.appendChild(statusCell);
                row.appendChild(actionCell);

                container.appendChild(row);
            });
        }

        // Get cookie value by name
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }