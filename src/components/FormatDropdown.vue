<template>
  <v-select
		v-model="input"
		:items="formats"
		:label="label"
		:disabled="disabled"
		:required="!disabled"
		:rules="[requiredRule]"
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
			label: { type: String },
			disabled: { type: Boolean }
		},
		data: function() {
			return {
				input: '',
				formats: [
					'3D',
					'3D/Bluray/DVD',
					'4K',
					'4K/Bluray',
					'4K/Bluray/DVD',
					'Bluray',
					'Bluray/DVD',
					'Digital',
					'DVD',
					'DVD (Copy)',
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
			requiredRule(val: any) {
				return !val && !this.disabled ? 'This field is required' : true;
			},
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
