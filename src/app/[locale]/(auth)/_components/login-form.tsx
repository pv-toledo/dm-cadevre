export default function LoginForm() {
    return (
        <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                {/* <Label htmlFor="email">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <FormInput {...field} id="email" type="email" placeholder="you@example.com" required />
                    )}
                /> */}
            </div>

            {/* <PasswordField control={control} /> */}

            {/* {serverError && (
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>{serverError}</AlertTitle>
                </Alert>
            )} */}

            {/* <FormButton type="submit" disabled={isPending} className="w-full">
                {isPending ? "Signing in…" : "Sign in"}
            </FormButton> */}
        </form>
    )
}