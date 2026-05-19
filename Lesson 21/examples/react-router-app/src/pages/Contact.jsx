import { useState } from 'react'
import {
    Form, FormGroup, Label, Input, Button
} from 'reactstrap'

function Contact() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Message Sent:", formData)

        // In a real app, you would send this data to your backend
        alert("Message sent! (We'll ignore it)")

        // Clear form
        setFormData({ name: '', email: '', message: '' })
    }

    return (
        <div className="page fade-in">
            <h1 className="text-center">Contact Us</h1>

            <div className="max-w-500 mx-auto mt-4">

                {/* Demo Contact Form */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Your Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup className="mt-3">
                        <Label>Your Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup className="mt-3">
                        <Label>Message</Label>
                        <Input
                            type="textarea"
                            rows="5"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <Button type="submit" color="primary" className="mt-3">
                        Send Message
                    </Button>
                </Form>

                {/* Contact Info */}
                <div className="card mt-5">
                    <div className="text-center">
                        <h5>Support</h5>
                        <p>[EMAIL_ADDRESS]</p>
                    </div>
                </div>
            </div>
            </div>
    )
}

export default Contact