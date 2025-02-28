import React from 'react';
import { InputBox, Button, AppIcon } from '@shared/index';
import { PASSWORD_FIELDS } from './constant';

export const SecurityForm = ({ passwordData, handlePasswordChange, handleSubmit }) => (
  <form className="space-y-4" onSubmit={handleSubmit}>
    {PASSWORD_FIELDS.map(field => (
      <InputBox
        key={field.name}
        {...field}
        type="password"
        value={passwordData[field.name]}
        onChange={handlePasswordChange}
        icon="password"
        showPasswordToggle
        required
      />
    ))}
    <Button
      variant="primary"
      size="medium"
      type="submit"
      className="mt-4"
    >
      Update Password
    </Button>
  </form>
);