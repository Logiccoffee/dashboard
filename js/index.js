import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

const loginToken = getCookie("login");

if (!loginToken || loginToken.trim() === "") {
    redirect("/");
} else {
    fetchUserData();
}

async function fetchUserData() {
    try {
        const response = await fetch(
            "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginToken}`,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu.");
                redirect("/register");
            } else {
                throw new Error("Gagal mengambil data pengguna");
            }
        }

        const result = await response.json();
        handleUserResponse(result);
    } catch (error) {
        console.error("Error saat mengambil data pengguna:", error);
    }
}

function handleUserResponse(result) {
    if (result.data && result.data.name) {
        const userNameElement = document.getElementById("user-name");
        if (userNameElement && userNameElement.textContent === "") {
            setInner("content", "Selamat datang " + result.data.name);
            userNameElement.textContent = result.data.name;

            switch (result.data.role) {
                case "user":
                case "dosen":
                    redirect("/menu");
                    break;
                case "admin":
                    redirect("/dashboard-admin");
                    break;
                case "cashier":
                    redirect("/dashboard-cashier");
                    break;
                default:
                    redirect("/");
                    break;
            }
        }
    } else {
        setInner("content", "Data pengguna tidak valid.");
    }
}
