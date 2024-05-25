<template>
    <div class="container">
        <div v-if="user">
            <h1 class="my-5 display-1 text-center">Promenite podatke korisnika</h1>
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
                    <button type="submit" class="btn btn-primary center btn-lg me-3 my-3">Promeni podatke</button>
                    <button type="button" class="btn btn-danger btn-lg me-3 my-3" @click="userDel = true">Obrisi korisnika</button>
                </div>
            </form>
        </div>
        <div v-else class="fs-1 text-center">Loading...</div>

        <BModal id="deletUserModal" v-model="userDel" title="Da li zelite da obriste nalog">
                <div class="modal-body">Da li ste sigurni da zelite da obirsete nalog</div>
                <template #footer>
                    <button type="button" class="btn btn-secondary" @click="userDel = false">Odustani</button>
                    <button type="button" class="btn btn-danger" @click="deleteUser">Obrisi nalog</button>
                </template>
            </BModal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
            userDel: false,
        };
    },
    async created() {
        try {
            const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.$route.params.id + '.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const user = await response.json();

            this.user = user;
        } catch (error) {
            localStorage.setItem('error', error.message);
            this.$router.push('/error');
        }
    },
    methods: {
        async validateUser() {
            if (this.user.korisnickoIme === '' || this.user.adresa === '' || this.user.email === '' || this.user.datumRodjenja === '' || this.user.ime === '' || this.user.prezime === '' || this.user.telefon === '' || this.user.zanimanje === '') {
                window.alert('Morate popuniti sva polja');
                return;
            }
            if (/[a-zA-Z]/.test(this.user.telefon)) {
                alert('Telefon ne sme sadržati slova');
                return;
            }
            const phoneNumber = this.user.telefon.replace(/\D/g, '');
            if (phoneNumber.length < 9 || phoneNumber.length > 10) {
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
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.$route.params.id + '.json', {
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
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
        async deleteUser() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici/' + this.$route.params.id + '.json', {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.userDel = false;
                window.alert('Uspesno ste obrisali nalog');
                this.$router.push('/users');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        }
    }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>