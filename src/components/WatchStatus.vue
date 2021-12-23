<template>
  <v-select
		v-model="input"
		:items="statuses"
		label="Watch Status"
    @input="assignValue"
    @blur="emitValue"
	></v-select>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		name: "WatchStatus",
		props: {
			value: { type: String },
		},
		data: function() {
			return {
				input: '',
				statuses: [
					'Watched',
					'Need To Watch'
				]
			};
		},
		watch: {
			value(val) {
				if (this.input === val) {
					return;
				}
				this.input = val;
			}
		},
		created() {
			if (this.value){
				this.input = this.value;
			}
		},
		methods: {
			assignValue(value: string) {
				this.input = value;
				this.emitValue();
			},
			emitValue() {
				this.$emit('input', this.input);
			}
		}
	});
</script>
