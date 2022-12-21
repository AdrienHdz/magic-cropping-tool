type Nullable<T> = T | null;

export interface IUploadedImage {
    file: File | null,
    width?: number | null,
    height?: number | null
}
