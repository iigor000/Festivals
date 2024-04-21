<template>
    <div class="gradient-bg text-center container-fluid">
    </div>
    <div class="text-center mb-5">
        <h1><i class="bi bi-person-circle text-white" :style="{ fontSize: '20rem' }"> </i></h1>
        <div v-if="user" class="container text-center bg-white border shadow"
            :style="{ width: '40%', minWidth: '450px', borderRadius: '20px' }">
            <div v-if="edit">
                <form @submit.prevent="validateUser" class="text-center my-3">
                    <div class="mb-3 text-start">
                        <label for="username" class="form-label fs-5">Korisnicko ime</label>
                        <input type="text" class="form-control mb-2 fs-5" id="username" v-model="user.korisnickoIme">
                        <label for="adress" class="form-label fs-5">Adresa</label>
                        <input type="text" class="form-control mb-2 fs-5" id="adress" v-model="user.adresa">
                        <label for="email" class="form-label fs-5">Email</label>
                        <input type="email" class="form-control mb-2 fs-5" id="email" @input="validateEmail"
                            v-model="user.email">
                        <label for="birthdate" class="form-label fs-5">Datum rodjenja</label>
                        <input type="date" class="form-control mb-2 fs-5" id="birthdate" v-model="user.datumRodjenja">
                        <label for="name" class="form-label fs-5">Ime</label>
                        <input type="text" class="form-control mb-2 fs-5" id="name" v-model="user.ime">
                        <label for="lastname" class="form-label fs-5">Prezime</label>
                        <input type="text" class="form-control mb-2 fs-5" id="lastname" v-model="user.prezime">
                        <label for="tel" class="form-label fs-5">Telefon</label>
                        <input type="phone" class="form-control mb-2 fs-5" id="phone" v-model="user.telefon">
                        <label for="ocupation" class="form-label fs-5">Zanimanje</label>
                        <input type="text" class="form-control mb-2 fs-5" id="ocupation" v-model="user.zanimanje">
                    </div>
                    <div class="column">
                        <button class="btn btn-danger center btn-lg me-3 my-3" @click="edit = false">Odustani</button>
                        <button type="submit" class="btn btn-primary center btn-lg me-3 my-3">Promeni podatke</button>
                    </div>
                </form>
            </div>
            <div v-else-if="pasChange">
                <form @submit.prevent="validatePassword" class="text-center my-3">
                    <div class="mb-3 text-start">
                        <label for="oldPassword" class="form-label fs-5">Stara lozinka</label>
                        <input type="password" class="form-control mb-2 fs-5" id="oldPassword" v-model="oldPassword">
                        <label for="newPassword" class="form-label fs-5">Nova lozinka</label>
                        <input type="password" class="form-control mb-2 fs-5" id="newPassword" v-model="newPassword">
                        <label for="newPassword2" class="form-label fs-5">Ponovite novu lozinku</label>
                        <input type="password" class="form-control mb-2 fs-5" id="newPassword2" v-model="newPassword2">
                    </div>
                    <button class="btn btn-danger center btn-lg me-3 my-3" @click="pasChange = false">Odustani</button>
                    <button type="submit" class="btn btn-primary center btn-lg me-3 my-3">Promeni lozinku</button>
                </form>
            </div>
            <div v-else>
                <h1 class="text-center mb-5 mt-2 display-1" :style="{ fontWeight: 400 }">{{ user.korisnickoIme }}</h1>
                <div class="row mb-2">
                    <p class="fs-3">Adresa: {{ user.adresa }}</p>
                    <p class="fs-3">Email: {{ user.email }}</p>
                    <p class="fs-3">Datum rodjenja: {{ user.datumRodjenja }}</p>
                    <p class="fs-3">Ime: {{ user.ime }}</p>
                    <p class="fs-3">Prezime: {{ user.prezime }}</p>
                    <p class="fs-3">Telefon: {{ user.telefon }}</p>
                    <p class="fs-3">Zanimanje: {{ user.zanimanje }}</p>
                </div>
                <div class="column mb-4">
                    <button class="btn btn-primary btn-lg me-3 my-3" @click="edit = true">Izmeni podatke</button>
                    <button class="btn btn-primary btn-lg me-3 my-3" @click="pasChange = true">Promeni lozinku</button>
                    <button class="btn btn-danger btn-lg me-3 my-3" @click="userDel = true">Obrisi nalog</button>
                </div>
            </div>
            <BModal id="deletUserModal" v-model="userDel" title="Da li zelite da obriste nalog">
                <div class="modal-body">Da li ste sigurni da zelite da obirsete nalog</div>
                <template #footer>
                    <button type="button" class="btn btn-secondary" @click="userDel = false">Odustani</button>
                    <button type="button" class="btn btn-danger" @click="deleteUser">Obrisi nalog</button>
                </template>
            </BModal>


        </div>
        <div v-else class="container text-center bg-white border shadow"
            :style="{ width: '40%', minWidth: '450px', borderRadius: '20px' }">
            <h1 class="display-4 my-5">Molimo vas da se ulogujete</h1>
            <router-link to="/" class="btn btn-primary my-3 btn-lg">Povratak na pocetnu stranicu</router-link>
        </div>
    </div>

</template>

<script>
import { BModal } from 'bootstrap-vue-3'


export default {
    components: {
        BModal,
    },
    data() {
        return {
            userid: localStorage.getItem('userId'),
            user: null,
            edit: false,
            pasChange: false,
            userDel: false,
        }
    },
    async created() {
        if (this.userid) {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.userid + '.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const user = await response.json();

                this.user = user;
            } catch (error) {
                window.alert('There was a problem with the fetch operation: ' + error.message);
            }
        }
    },
    methods: {
        async validateUser() {
            if (this.user.korisnickoIme === '' || this.user.adresa === '' || this.user.email === '' || this.user.datumRodjenja === '' || this.user.ime === '' || this.user.prezime === '' || this.user.telefon === '' || this.user.zanimanje === '') {
                window.alert('Morate popuniti sva polja');
                return;
            }
            if(this.user.telefon.length < 9 || this.user.telefon.length > 10) {
                    alert('Telefon mora imati izmedju 9 i 10 cifara');
                    return;
                }
            this.submitUser();

        },
        validateEmail(event) {
            const input = event.target;
            if (!input.validity.valid) {
                if (input.validity.typeMismatch) {
                    input.setCustomValidity('Molimo vas unesite validan email');
                }
            } else {
                input.setCustomValidity('');
            }
        },
        async submitUser() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.userid + '.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.user),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.edit = false;
                window.alert('Uspesno ste promenili podatke');
            } catch (error) {
                window.alert('There was a problem with the request: ' + error.message);
            }
        },
        async validatePassword() {
            if (this.oldPassword === '' || this.newPassword === '' || this.newPassword2 === '') {
                window.alert('Morate popuniti sva polja');
                return;
            }
            if (this.newPassword.length < 6 || !/\d/.test(this.newPassword)) {
                window.alert('Lozinka mora imati bar 6 karaktera i sadrzati barem jedan broj');
                return;
            }
            this.changePassword();
        },
        async changePassword() {
            if ((this.newPassword === this.newPassword2) && (this.oldPassword === this.user.lozinka)) {
                try {
                    const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.userid + '.json', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ lozinka: this.newPassword }),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    this.pasChange = false;
                    window.alert('Uspesno ste promenili lozinku');
                } catch (error) {
                    window.alert('There was a problem with the request: ' + error.message);
                }
            } else {
                window.alert('Lozinke se ne poklapaju');
            }
        },
        async deleteUser() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.userid + '.json', {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.userDel = false;
                window.alert('Uspesno ste obrisali nalog');
                localStorage.removeItem('userId');
                location.reload();
            } catch (error) {
                window.alert('There was a problem with the request: ' + error.message);
            }
        }
    }
}
</script>

<style scoped>
.gradient-bg {
    height: 500px;
    /* This sets the height of the gradient to half the viewport height */
    background: linear-gradient(to bottom right, #24c3a6, #266056);
    position: absolute;
    width: 100%;
    z-index: -1;
}
</style>