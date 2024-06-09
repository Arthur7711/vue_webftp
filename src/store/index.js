import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    plugins: [
    ],
    state: {
        search: null,
        editId: false,
        success: null,
    },

    getters: {
        EditId: state => state.editId,
        JobRes: state => state.success
    },

    mutations: {
        setSearchM (state, search) {
            state.search = search;
        },
        setEditIdM (state, editId) {
            state.editId = editId;
        },
        setResultM (state, success) {
            state.success = success;
        }
    },

    actions: {
        setSearch ({commit}, search) {
            commit("setSearchM", search);
        },
        setEditId({commit}, editId) {
            commit("setEditIdM", editId);
        },
        setResult ({commit}, success) {
            commit("setResultM", success);
        }
    }
});
