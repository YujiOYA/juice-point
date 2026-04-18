"use client";

import AdminTable from "@molecule/AdminTable";
import Button from "@atom/Button";
import Card from "@atom/Card";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import UserCard from "@molecule/UserCard";
import { useUserManager } from "@hook/useUserManager";
import { User } from "@type/user";
import { AUTHORITY } from "@const/constDefinition";
import { LABELS } from "@const/labels";

const L  = LABELS.userManager;
const C  = LABELS.common;
const LA = LABELS.authority;

interface Props {
  initialUsers: User[];
}

const authorityLabel = (a: string) => (a === AUTHORITY.admin ? LA.admin : LA.user);

export default function UserManagerClient({ initialUsers }: Props) {
  const { users, sort, newForm, editForm, isLoading, handleDelete } = useUserManager(initialUsers);

  type SortKey = "user" | "authority";
  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "user",      label: L.sortByName },
    { value: "authority", label: L.sortByAuthority },
  ];

  return (
    <div>
      {/* 追加フォーム */}
      <Card variant="add" className="task-add-card">
        <h2 style={{ marginBottom: "1rem" }}>{L.headingAdd}</h2>
        <form onSubmit={newForm.onCreate} className="task-add-form">
          <TextInput
            placeholder={L.placeholderUser}
            value={newForm.values.user}
            onChange={(e) => newForm.setValues({ ...newForm.values, user: e.target.value })}
          />
          <TextInput
            type="password"
            placeholder={L.placeholderPin}
            value={newForm.values.pin}
            onChange={(e) => newForm.setValues({ ...newForm.values, pin: e.target.value })}
            style={{ maxWidth: "150px" }}
          />
          <SelectInput
            value={newForm.values.authority}
            onChange={(e) => newForm.setValues({ ...newForm.values, authority: e.target.value })}
          >
            <option value={AUTHORITY.user}>{LA.user}</option>
            <option value={AUTHORITY.admin}>{LA.admin}</option>
          </SelectInput>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {C.add}
          </Button>
        </form>
      </Card>

      {/* ユーザー一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>{L.headingList}</h2>

        {/* スマホ: ソート */}
        <div className="task-sort-bar">
          <span className="task-sort-label">{C.sortLabel}</span>
          <SelectInput value={sort.key} onChange={(e) => sort.handle(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          <Button variant="logout" onClick={() => sort.handle(sort.key)}>
            {sort.dir === "asc" ? C.sortAsc : C.sortDesc}
          </Button>
        </div>

        {/* スマホ: カード */}
        <div className="task-list">
          {users.map((u) =>
            editForm.id === u.id ? (
              <UserCard
                key={u.id}
                isEditing={true}
                user={u}
                editForm={editForm.values}
                isLoading={isLoading}
                onChangeForm={editForm.setValues}
                onSave={editForm.onUpdate}
                onCancel={() => editForm.setId(null)}
              />
            ) : (
              <UserCard
                key={u.id}
                isEditing={false}
                user={u}
                isLoading={isLoading}
                onEdit={editForm.start}
                onDelete={handleDelete}
              />
            )
          )}
        </div>

        {/* PC: テーブル */}
        <AdminTable
          columns={[
            { key: "user",      label: L.colName,      sortable: true },
            { key: "authority", label: L.colAuthority, sortable: true },
            { key: "actions",   label: "" },
          ]}
          sortKey={sort.key}
          sortDir={sort.dir}
          sortKey2={null}
          sortDir2="asc"
          onSort={(k) => sort.handle(k as SortKey)}
          onSort2={() => {}}
        >
          {users.map((u) => (
            <tr key={u.id}>
              {editForm.id === u.id ? (
                <>
                  <td>
                    <TextInput
                      value={editForm.values.user}
                      onChange={(e) => editForm.setValues({ ...editForm.values, user: e.target.value })}
                    />
                  </td>
                  <td>
                    <SelectInput
                      value={editForm.values.authority}
                      onChange={(e) => editForm.setValues({ ...editForm.values, authority: e.target.value })}
                    >
                      <option value={AUTHORITY.user}>{LA.user}</option>
                      <option value={AUTHORITY.admin}>{LA.admin}</option>
                    </SelectInput>
                  </td>
                  <td className="task-table__actions">
                    <TextInput
                      type="password"
                      placeholder={L.placeholderPinEdit}
                      value={editForm.values.pin}
                      onChange={(e) => editForm.setValues({ ...editForm.values, pin: e.target.value })}
                      style={{ width: "160px" }}
                    />
                    <Button variant="approve" disabled={isLoading} onClick={() => editForm.onUpdate(u.id)}>{C.save}</Button>
                    <Button variant="logout" onClick={() => editForm.setId(null)}>{C.cancel}</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.user}</td>
                  <td>{authorityLabel(u.authority)}</td>
                  <td className="task-table__actions">
                    <Button variant="primary" disabled={isLoading} onClick={() => editForm.start(u)}>{C.edit}</Button>
                    <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(u.id)}>{C.delete}</Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </AdminTable>
      </section>
    </div>
  );
}
