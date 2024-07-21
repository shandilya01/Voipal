import axios from "axios";

const GetContactListById = async(userId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/contactsbyid`, userId)
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        // return {
        //     success:false,
        //     error:(resp.message || "Could not fetch Contacts"),
        // }
        return {
            success : true,
            data : [
                {
                    id: "32313",
                    name: "Tushar",
                    email: "tushar0shandilya@gmail.com",
                    incantation: "tushar.tushar.tushar",
                    mobile: "",
                },
                {
                    id: "32314",
                    name: "John Doe",
                    email: "johndoe@example.com",
                    incantation: "john.john.john",
                    mobile: "1234567890",
                },
                {
                    id: "32315",
                    name: "Jane Smith",
                    email: "janesmith@example.com",
                    incantation: "jane.jane.jane",
                    mobile: "0987654321",
                },
                {
                    id: "32316",
                    name: "Alice Johnson",
                    email: "alicejohnson@example.com",
                    incantation: "alice.alice.alice",
                    mobile: "1122334455",
                },
                {
                    id: "32317",
                    name: "Bob Brown",
                    email: "bobbrown@example.com",
                    incantation: "bob.bob.bob",
                    mobile: "2233445566",
                },
                {
                    id: "32318",
                    name: "Charlie Davis",
                    email: "charliedavis@example.com",
                    incantation: "charlie.charlie.charlie",
                    mobile: "3344556677",
                },
                {
                    id: "32319",
                    name: "Dana White",
                    email: "danawhite@example.com",
                    incantation: "dana.dana.dana",
                    mobile: "4455667788",
                },
                {
                    id: "32320",
                    name: "Eve Black",
                    email: "eveblack@example.com",
                    incantation: "eve.eve.eve",
                    mobile: "5566778899",
                },
                {
                    id: "32321",
                    name: "Frank Green",
                    email: "frankgreen@example.com",
                    incantation: "frank.frank.frank",
                    mobile: "6677889900",
                },
                {
                    id: "32322",
                    name: "Grace Harris",
                    email: "graceharris@example.com",
                    incantation: "grace.grace.grace",
                    mobile: "7788990011",
                }
            ],
            status:200,
        }
    }
}

export {GetContactListById};