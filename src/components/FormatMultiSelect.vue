<template>
  <v-combobox
		v-model="selected"
		:items="formats"
		:label="label"
		:disabled="disabled"
		:required="!disabled"
		:rules="[requiredRule]"
    @input="assignValue"
    @blur="emitValue"
		multiple
		small-chips
	></v-combobox>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		name: "FormatMultiSelect",
		props: {
			value: { type: Array },
			label: { type: String },
			disabled: { type: Boolean }
		},
		data: function() {
			return {
				selected: [] as Array<any>,
				formats: [
					'3D',
					'4K',
					'Bluray',
					'Digital',
					'DVD',
					'DVD (Copy)',
					'VHS'
				]
			};
		},
		watch: {
			value(val) {
				if (this.selected === val) {
					return;
				}
				this.selected = val;
			}
		},
		created() {
			if (this.value){
				this.selected = this.value;
			}
		},
		methods: {
			requiredRule(val: any) {
				return !val && !this.disabled ? 'This field is required' : true;
			},
			assignValue(value: Array<any>) {
				this.selected = value;
				this.emitValue();
			},
			emitValue() {
				this.$emit('input', this.selected);
			}
		}
	});
</script>
