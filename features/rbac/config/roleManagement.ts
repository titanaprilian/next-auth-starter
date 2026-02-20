import {
  Shield,
  ShieldPlus,
  ShieldCheck,
  ShieldAlert,
  FileText,
} from "lucide-react";

export const roleManagementConfig = {
  pageTitleKey: "role.pageTitle",
  descriptionKey: "role.description",
  label: "role",
  filterDescriptionKey: "role.filterDescription",
  searchPlaceholderKey: "role.searchPlaceholder",
  avatarIcon: Shield,
  viewFields: [
    {
      labelKey: "role.fields.name",
      value: "name",
      icon: Shield,
    },
    {
      labelKey: "role.fields.description",
      value: "description",
      icon: FileText,
    },
  ],
  dialog: {
    add: {
      icon: ShieldPlus,
      titleKey: "role.add.title",
      descriptionKey: "role.add.description",
    },
    edit: {
      icon: ShieldCheck,
      titleKey: "role.edit.title",
      descriptionKey: "role.edit.description",
    },
    view: {
      icon: ShieldAlert,
      titleKey: "role.view.title",
      descriptionKey: "role.view.description",
    },
  },
  delete: {
    titleKey: "role.delete.title",
    descriptionKey: "role.delete.description",
    confirmButtonKey: "role.delete.confirmButton",
  },
  pagination: {
    showingKey: "role.pagination.showing",
    rowsKey: "role.pagination.rows",
  },
  form: {
    name: {
      labelKey: "role.form.name.label",
      placeholderKey: "role.form.name.placeholder",
    },
    description: {
      labelKey: "role.form.description.label",
      placeholderKey: "role.form.description.placeholder",
    },
    permissions: {
      labelKey: "role.form.permissions.label",
      placeholderKey: "role.form.permissions.placeholder",
      selectedKey: "role.form.permissions.selected",
      selectedPluralKey: "role.form.permissions.selectedPlural",
      doneKey: "role.form.permissions.done",
    },
    resetButton: "role.form.resetButton",
    saveButton: "role.form.saveButton",
    savingText: "role.form.savingText",
  },
  table: {
    no: "role.table.no",
    name: "role.table.name",
    description: "role.table.description",
    permissions: "role.table.permissions",
    createdAt: "role.table.createdAt",
    actions: "role.table.actions",
    noResults: "role.table.noResults",
  },
};
