# Classes Page Frontend Plan

## Backend Contract

Use the Dwelve backend as the source of truth for permissions, school isolation,
and uploaded image URLs.

Base API behavior:

- `GET /classes` returns the caller's visible active classes for the selected
  school context.
- `GET /classes/:classId` returns one visible class.
- `POST /classes` is admin-only and accepts `multipart/form-data`.
- `PATCH /classes/:classId` is admin-only and accepts `multipart/form-data`.
- `DELETE /classes/:classId` is admin-only and soft-deletes the class.
- `POST /schools` accepts `multipart/form-data` with an optional `logo` file.
- `PATCH /schools/:schoolId` accepts `multipart/form-data` with optional
  `logo` or `removeLogo=true`.

Image uploads:

- Send school logos as `logo`.
- Send class pictures as `picture`.
- Accept only `image/png`, `image/jpeg`, and `image/webp`.
- Do not send user-entered external `logoUrl` values.
- Store and render backend-returned `logoUrl` and `pictureUrl`.

Removed class field:

- Remove `gradeLevel` from class schemas, forms, request bodies, mappings,
  translations, cards, detail views, and docs.

## Data Contracts

Class view model:

```ts
type ClassItem = {
  id: string;
  schoolId: string;
  name: string;
  description: string | null;
  pictureUrl: string | null;
  isActive: boolean;
  teachers: ClassPerson[];
  students: ClassPerson[];
  counts: {
    teachers: number;
    students: number;
  };
  createdAt: string;
  updatedAt: string;
};
```

School create/update inputs:

```ts
type CreateSchoolInput = {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  logo?: File;
};

type UpdateSchoolInput = Partial<CreateSchoolInput> & {
  removeLogo?: boolean;
};
```

Class create/update inputs:

```ts
type CreateClassInput = {
  name: string;
  description?: string;
  picture?: File;
};

type UpdateClassInput = {
  name?: string;
  description?: string;
  isActive?: boolean;
  picture?: File;
  removePicture?: boolean;
};
```

## School Creation And Edit

- Replace the logo URL input with a file input:
  `accept="image/png,image/jpeg,image/webp"`.
- Submit `FormData` through the existing server-action -> endpoint-function ->
  `authedBackendJson` path.
- Show a selected-logo preview before submit.
- Surface backend validation errors for invalid type or oversized files.
- Keep the existing session refresh behavior after school creation.

## Classes Page

- Make `/groups` the real class directory.
- Admins see create class, edit, delete, add test, and add exam actions.
- Teachers and students see read-only cards for visible classes.
- Add test/add exam are coming-soon actions only; show localized text/toast and
  do not call backend exam mutations yet.
- Class cards show `pictureUrl` thumbnails when present.
- Without a picture, use a stable initials/accent fallback.

## Class Detail Page

- Add `/groups/[classId]`.
- Fetch `GET /classes/:classId`.
- Show picture, name, description, teachers, students, counts, and status.
- Admin toolbar includes edit, delete, add test, and add exam.
- Delete uses a confirmation dialog and calls backend soft delete.

## Class Create And Edit

- Remove the grade/level field.
- Add an optional class picture file input and preview.
- Edit supports replacing the picture and removing the picture.
- Use existing React Query invalidation and server actions.

## Smoke Test

- Create a school with a logo.
- Create a class with a picture.
- Edit the class picture.
- Remove the class picture.
- Delete the class and confirm it disappears from `/groups`.
- Open `/groups/[classId]` as a permitted user.
- Verify non-admin roles do not see admin actions.
