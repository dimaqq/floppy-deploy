import { Request } from 'express';
import { Document, WithId } from 'mongodb';

interface Job {
  attrs: {
    data: unknown;
  };
}

interface ThumbnailJobData extends WithId<Document> {
  filename: string;
  originalFilename: string;
  status: string;
  thumbnailFilename: string;
}

interface GetThumbnailJobResponse extends ThumbnailJobData {
  thumbnailLink: string;
}

interface ThumbnailJob extends Job {
  attrs: {
    data: ThumbnailJobData;
  };
}

interface PostFileRequest extends Request {
  fileValidationError?: string;
}

export type {
  Job,
  ThumbnailJob,
  ThumbnailJobData,
  GetThumbnailJobResponse,
  PostFileRequest
};
