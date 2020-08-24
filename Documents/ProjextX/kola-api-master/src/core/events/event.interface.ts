export interface IEvent<T>{
    consumer: string;
    name: string;
    data: T;
}
