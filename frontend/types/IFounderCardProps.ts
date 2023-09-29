export interface ISocialProps {
    icon: string;
    name: string;
    link: string;
}
export interface IFounderCardProps {
    image: string;
    alt: string;
    name: string;
    job: string;
    description: string;
    socials: ISocialProps[];
}
