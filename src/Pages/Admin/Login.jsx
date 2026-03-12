import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import supabase from '@/supabase-client'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const submitForm = async (e) => {
        e.preventDefault();

        // Fetch users from the database
        const { data: users, error } = await supabase.
            from('user_tbl')
            .select('*');

        // If error occurs during fetching, set the error state and return the error message to the form
        if (error) {
            setError('An error occurred while fetching data.');
            return;
        }

        // Authentication logic: Check if the provided username and password match any user in the database
        const foundUser = users.find(
            (user) => user.username === username && user.password === password
        );

        if (foundUser) {
            setIsLoggedIn(true);
            setError('');
            console.log('Logged in user:', foundUser);

            // Update the user active status in the database
            const { error: updateError } = await supabase
                .from('user_tbl')
                .update({ active: true })
                .eq('id', foundUser.id)
                .eq('email', foundUser.email);

            if (updateError) {
                setError('An error occurred while updating user status.');
                return;
            }

            // redirect to the dashboard page
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password.');
        }
    }

    return (
        <>
            <div className="w-full h-screen" style={{ background: "linear-gradient(90deg, #5AB2F7, #12CFF3)" }}>
                <div className="flex justify-center items-center h-full">
                    <div className="bg-white w-[350px] min-h-30 shadow px-6 py-6 rounded-lg">
                        <div className="mb-4">
                            <img src="logo.png" alt="Logo" className="mx-auto w-fit h-[80px]" />
                            <h2 className="text-2xl font-bold text-center mb-6 text-cyan-500">Talent Hatch</h2>
                        </div>

                        <form onSubmit={submitForm}>
                            <div className="mb-4">
                                <Label htmlFor='username'>Username</Label>
                                <Input
                                    id='username'
                                    type='text'
                                    className='focus:border-cyan-500 focus:ring-0 focus-visible:ring-0'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    className='focus:border-cyan-500 focus:ring-0 focus-visible:ring-0'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <a href="#" className="text-xs text-end mb-4 block font-semibold hover:text-cyan-600">Forgot Password?</a>

                            <Button type='submit' className="w-full">Login</Button>

                            {/* Display error message if there is an error during login */}
                            {
                                error && <p className="text-red-600 text-xs mt-4">{error}</p>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
