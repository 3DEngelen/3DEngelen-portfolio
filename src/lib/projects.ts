import { getCollection, type CollectionEntry } from 'astro:content';
import generated from '../generated/projects.json';

export type Project = CollectionEntry<'projects'>;
export type GalleryImage = { src: string; width: number; height: number; caption?: string };
type ImageSet = { hero: GalleryImage; card: GalleryImage; gallery: GalleryImage[]; previews: Record<string, GalleryImage> };
const images = generated as Record<string, ImageSet>;

export function projectImages(project: Project): ImageSet {
  const result = images[project.id];
  if (!result) throw new Error(`No generated images for ${project.id}`);
  return result;
}

export async function allProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort(
    (a, b) => b.data.completed.localeCompare(a.data.completed) || a.id.localeCompare(b.id),
  );
}

export function projectUrl(project: Project): string {
  return `${import.meta.env.BASE_URL}projects/${project.id}/`;
}

export function imageUrl(src: string): string {
  return `${import.meta.env.BASE_URL}${src}`;
}
