import { type FormEvent, useState } from 'react';
import { useAvatars, useCreateChild, useUpdateChild } from '@/api/hooks';
import type { Child, Gender, SupportNeed } from '@/api/types';
import { AvatarImage } from '@/components/AvatarImage';
import { Button } from '@/components/Button';
import { errorMessage } from '@/lib/errors';
import { SelectField, TextField } from '@/components/Field';
import { Modal } from '@/components/Modal';

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'UNSPECIFIED', label: 'Prefiero no decirlo' },
  { value: 'GIRL', label: 'Niña' },
  { value: 'BOY', label: 'Niño' },
];

const supportOptions: { value: SupportNeed; label: string }[] = [
  { value: 'NONE', label: 'Ninguna' },
  { value: 'ADHD', label: 'TDAH' },
];

interface ChildFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Si se pasa, el formulario edita ese perfil; si no, crea uno nuevo. */
  child?: Child;
}

export function ChildFormModal({ open, onClose, child }: ChildFormModalProps) {
  return (
    <Modal title={child ? `Editar a ${child.name}` : 'Nuevo perfil'} open={open} onClose={onClose}>
      {/* La key reinicia el formulario cada vez que se abre con otro perfil. */}
      {open && <ChildForm key={child?.id ?? 'new'} child={child} onDone={onClose} />}
    </Modal>
  );
}

function ChildForm({ child, onDone }: { child?: Child; onDone: () => void }) {
  const { data: avatars = [] } = useAvatars();
  const createChild = useCreateChild();
  const updateChild = useUpdateChild(child?.id ?? '');
  const mutation = child ? updateChild : createChild;
  const [avatarId, setAvatarId] = useState<number | undefined>(child?.avatarId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await mutation.mutateAsync({
      name: String(form.get('name')).trim(),
      gender: form.get('gender') as Gender,
      supportNeed: form.get('supportNeed') as SupportNeed,
      avatarId: avatarId ?? avatars[0]?.id,
    });
    onDone();
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event).catch(() => undefined)}
      className="flex flex-col gap-4"
    >
      <TextField
        label="Nombre"
        name="name"
        defaultValue={child?.name}
        maxLength={40}
        placeholder="Ej: Sofía"
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Género"
          name="gender"
          defaultValue={child?.gender ?? 'UNSPECIFIED'}
          options={genderOptions}
        />
        <SelectField
          label="Necesidad de apoyo"
          name="supportNeed"
          defaultValue={child?.supportNeed ?? 'NONE'}
          options={supportOptions}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-brand-900">Avatar</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {avatars.map((avatar) => {
            const selected = (avatarId ?? avatars[0]?.id) === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setAvatarId(avatar.id)}
                aria-pressed={selected}
                aria-label={avatar.name}
                className={`rounded-2xl p-1 transition ${selected ? 'bg-brand-200 ring-4 ring-brand-500' : 'bg-brand-50 hover:bg-brand-100'}`}
              >
                <AvatarImage avatarId={avatar.id} className="mx-auto h-20 w-full" />
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="text-xs text-ink/70">
        La necesidad de apoyo es un dato sensible: solo tú puedes verla y nos ayuda a adaptar la
        experiencia.
      </p>

      {mutation.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {errorMessage(mutation.error)}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {child ? 'Guardar' : 'Crear perfil'}
        </Button>
      </div>
    </form>
  );
}
