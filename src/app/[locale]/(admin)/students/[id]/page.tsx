type SingleStudentPageProps = {
    params: Promise<{id: string}>
}

export default async function SingleStudentPage({params}: SingleStudentPageProps) {
    const {id} = await params
    return (
        <p>{id}</p>
    )
}