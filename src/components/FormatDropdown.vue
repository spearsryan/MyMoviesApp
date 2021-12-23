<template>
  <v-select
		v-model="input"
		:items="formats"
		label="Formats"
    @input="assignValue"
    @blur="emitValue"
	></v-select>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		name: "FormatDropdown",
		props: {
			value: { type: String },
		},
		data: function() {
			return {
				input: '',
				formats: [
					'4K',
					'4K/Bluray',
					'Bluray',
					'DVD',
					'VHS'
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
