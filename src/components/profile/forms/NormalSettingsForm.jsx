import React from "react";
import FormRow from "./FormRow";
import SubmitButton from "./SubmitButton";

function NormalSettingsForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <FormRow label="Your Name" required>
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          required
          className="input-field"
        />
      </FormRow>
      <FormRow label="Your Email" required>
        <input
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
          required
          className="input-field"
        />
      </FormRow>
      <SubmitButton loading={loading} text="Save" />
    </form>
  );
}

export default NormalSettingsForm;
