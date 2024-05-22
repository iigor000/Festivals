<template>
    <BModal id="loginModal" v-model="showModal" :title="formType" centered>
        <div class="modal-body">
            <form v-if="formType === 'Ulogujte se'" @submit.prevent="validateUser">
                <div class="mb-3 text-start">
                    <label for="username" class="form-label">Korisnicko ime</label>
                    <input type="text" class="form-control" id="username" v-model="user.korisnickoIme">
                    <label for="password" class="form-label">Lozinka</label>
                    <input type="password" class="form-control" id="password" v-model="user.lozinka">
                </div>
            </form>
            <form v-else @submit.prevent="validateUser">
                <div class="mb-3 text-start">
                    <label for="username" class="form-label">Korisnicko ime</label>
                    <input type="text" class="form-control" id="username" v-model="user.korisnickoIme">
                    <label for="password" class="form-label">Lozinka</label>
                    <input type="password" class="form-control" id="password" v-model="user.lozinka">
                    <label for="adress" class="form-label">Adresa</label>
                    <input type="text" class="form-control" id="adress" v-model="user.adresa">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-control" v-model="user.email">
                    <label for="birthdate" class="form-label">Datum rodjenja</label>
                    <input type="date" class="form-control" id="birthdate" v-model="user.datumRodjenja">
                    <label for="name" class="form-label">Ime</label>
                    <input type="text" class="form-control" id="name" v-model="user.ime">
                    <label for="lastname" class="form-label">Prezime</label>
                    <input type="text" class="form-control" id="lastname" v-model="user.prezime">
                    <label for="tel" class="form-label">Telefon</label>
                    <input type="phone" class="form-control" id="phone" v-model="user.telefon">
                    <label for="ocupation" class="form-label">Zanimanje</label>
                    <input type="text" class="form-control" id="ocupation" v-model="user.zanimanje">
                </div>
            </form>
            <div class="text-start">
                <button type="button" class="btn btn-link" @click="switchFormType">{{ formType === 'Ulogujte se'
                    ? 'Nemate nalog?' : 'Vec imate nalog?' }}</button>
            </div>
        </div>
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="showModal = false">Zatvori</button>
            <button type="button" class="btn btn-primary" @click="validateUser">{{ formType }}</button>
        </template>
    </BModal>

    <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div class="container-fluid">
            <a class="navbar-brand fs-1" href="#"><img src=".\..\assets\logo.png" :style="{ height: '50px' }"></a>
            <button class="navbar-toggler" type="button" @click="isNavbarOpen = !isNavbarOpen" aria-expanded="false"
                aria-label="Toggle navigation" ref="navbarToggler">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse justify-content-end" v-show="isNavbarOpen" @click.self="isNavbarOpen = false"
                id="navbarNav" ref="navbarMenu">
                <ul class="navbar-nav">
                    <li class="nav-item fs-4" v-for="link in links" :key="link.id">
                        <a class="nav-link" :href="link.url">{{ link.label }}</a>
                    </li>
                </ul>
                <button class="nav-link fs-4 btn-link text-nowrap hover-none" v-if="!loggedIn"
                    @click="showModal = true">Ulogujte se</button>
                <button class="nav-link fs-4 btn-link text-nowrap" v-else @click.prevent="logout">Izlogujte se</button>
            </div>
        </div>
    </header>


</template>

<script>
import { BModal } from 'bootstrap-vue-3'

export default {
    components: {
        BModal,
    },
    data() {
        return {
            links: [
                { id: 1, label: "Organizatori", url: "/" },
                { id: 2, label: "Festivali", url: "/festivali" },
            ],
            loggedIn: false,
            formType: 'Ulogujte se',
            user: {
                korisnickoIme: '',
                lozinka: '',
                adresa: '',
                email: '',
                datumRodjenja: '',
                ime: '',
                prezime: '',
                telefon: '',
                zanimanje: '',
            },
            showModal: false,
            isNavbarOpen: false,
        };
    },
    created() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.loggedIn = true;
            this.links.push({ id: 3, label: "Moj profil", url: "/account" });
            this.links.push({ id: 4, label: "Korisnici", url: "/users" });
        }
    },
    methods: {
        logout() {
            this.loggedIn = false;
            localStorage.removeItem('userId');
            this.links.pop();
            location.reload();
        },
        switchFormType() {
            this.formType = this.formType === 'Ulogujte se' ? 'Registrujte se' : 'Ulogujte se';
        },
        async validateUser() {
            console.log(this.user);

            if (this.formType === 'Ulogujte se') {
                if (this.user.korisnickoIme === '' || this.user.loznika === '') {
                    alert('Morate uneti korisnicko ime i lozinku');
                    return;
                }
                await this.loginUser();
            } else {
                if (Object.values(this.user).some(value => value === '')) {
                    alert('Morate popuniti sva polja');
                    console.log(this.user);
                    return;
                }
                if (this.user.lozinka.length < 6 || /\d/.test(this.user.lozinka) === false) {
                    alert('Lozinka mora imati najmanje 6 karaktera i bar jedan broj');
                    return;
                }
                const phoneNumber = this.user.telefon.replace(/\D/g, '');
                if (phoneNumber.length < 9 || phoneNumber.length > 10) {
                    alert('Telefon mora imati izmedju 9 i 10 cifara');
                    return;
                }
                if (!this.user.email.includes('@')) {
                    alert('Email nije validan');
                    return;
                }
                await this.registerUser();
                await this.loginUser();
            }
        },
        async loginUser() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const users = await response.json();

                for (const key in users) {
                    if (users[key].korisnickoIme === this.user.korisnickoIme && users[key].lozinka === this.user.lozinka) {
                        this.loggedIn = true;
                        this.showModal = false;
                        localStorage.setItem('userId', key);
                        location.reload();
                    }
                }
                if (!this.loggedIn) {
                    alert('Pogresno korisnicko ime ili lozinka');
                }
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
        async registerUser() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.user),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.showModal = false;
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        }
    }
};
</script>
