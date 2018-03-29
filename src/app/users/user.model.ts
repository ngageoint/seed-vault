export class User {
    private static build(data) {
        if (data) {
            return new User(
                data.role,
                data.ID,
                data.username,
                data.password,
                data.icon,
                data.isRemoving
            );
        }
    }
    public static transformer(data) {
        if (data) {
            if (Array.isArray(data)) {
                return data.map(item => User.build(item));
            }
            return User.build(data);
        }
        return null;
    }

    constructor(
        public role: string,
        public ID?: any,
        public username?: string,
        public password?: string,
        public icon?: string,
        public isRemoving?: boolean
    ) {}
}
