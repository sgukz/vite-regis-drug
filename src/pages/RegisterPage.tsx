import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// import NotificationsIcon from '@mui/icons-material/Notifications';
// import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { red, green, grey } from '@mui/material/colors';

import axios from 'axios'
import liff from "@line/liff";
import dayjs from 'dayjs';
import 'dayjs/locale/th'
dayjs.locale('th')
import imgBanner from '../assets/messageImage.jpg'
import defaultImg from '../assets/default_large.png'

import './RegisterPage.css'


// const redColor = red[900];
// const greenColor = green[900];
// const greyColor = grey[400];

const API_URL = import.meta.env.VITE_API_URL
const API_TOKEN: string = import.meta.env.VITE_API_TOKEN

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RegisterPage = () => {
    const [department, setDepartment] = useState<{
        depcode: string,
        department: string,
    }[]>([{
        depcode: '',
        department: '',
    }]);

    const [formRegister, setFormRegister] = useState<{
        userId?: string,
        depcode: string,
        department: string,
        pharm_name: string
    }>({
        userId: '',
        depcode: '',
        department: '',
        pharm_name: ''
    })

    const [displayData, setDisplayData] = useState<{
        userId: string,
        depcode: string,
        department: string,
        pharm_name: string,
        created_date: string
    }[]>([])

    const [profileLine, setProfileLine] = useState<{
        avatarImg?: string,
        displayName?: string,
    }>({})

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const [isNotify, setIsNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState<{
        type?: string,
        title?: string,
        text?: string
    }>({
        type: "success",
        title: "แจ้งเตือน",
        text: "ลงทะเบียนเรียบร้อย"
    })

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        if (formRegister.depcode !== '') {
            axios.post(`${API_URL}/createRegister`, formRegister, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": 'application/json',
                    "Authorization": `Bearer ${API_TOKEN}`
                },
            })
                .then(function (response) {
                    const { data, status } = response
                    if (status === 200) {
                        const { type, msg } = data
                        setNotifyMessage({
                            type: type,
                            title: "แจ้งเตือน",
                            text: msg
                        })
                        setOpen(true)
                    }
                })
                .catch(function (error) {

                    const { response, message } = error
                    const { data } = response
                    setNotifyMessage({
                        type: "error",
                        title: "แจ้งเตือน",
                        text: data.msg !== undefined ? data.msg : message
                    })
                    setOpen(true)
                });
        } else {
            setNotifyMessage({
                type: "warning",
                title: "แจ้งเตือน",
                text: "โปรดระบุร้านยาที่ต้องการลงทะเบียน"
            })
            setIsNotify(true)
            setOpen(true);
        }
        event.preventDefault()
    }

    // const handleNotifyClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     setIsNotify(!true)
    //     setNotifyMessage({
    //         type: "",
    //         title: "",
    //         text: ""
    //     })
    //     e.preventDefault();
    // }

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormRegister(prestate => ({
            ...prestate,
            [name]: value
        }))
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotifyMessage({
            type: "",
            title: "",
            text: ""
        })
        setOpen(false);
    };



    const loadData = () => {
        axios.get(`${API_URL}/getKSKDepartmentAll`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": `Bearer ${API_TOKEN}`
            },
        })
            .then(function (response) {
                const { status } = response
                if (status === 200) {
                    setDepartment(response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const loadDataUser = (user: string) => {
        axios.get(`${API_URL}/getRegisterByUserId?userId=${user}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": `Bearer ${API_TOKEN}`
            },
        })
            .then(function (response) {
                const { status } = response
                if (status === 200) {
                    setIsRegister(true)
                    setDisplayData(response.data.data)
                } else {
                    setIsRegister(!true)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const InitailizeLiff = async () => {
        await liff.init(
            {
                liffId: "2000438386-ZDQ6d0QJ",
            },
            () => {
                if (liff.isLoggedIn()) {
                    liff.getProfile().then((profile) => {
                        loadData()
                        loadDataUser(profile.userId)
                        setFormRegister(prestate => ({
                            ...prestate,
                            userId: profile.userId
                        }))
                        setProfileLine({
                            avatarImg: profile.pictureUrl,
                            displayName: profile.displayName
                        })
                    });
                }
            },
            (err) => console.log(err)
        );
    }

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(!true)
            InitailizeLiff()
        }, 1800)
        // setProfileLine({
        //     avatarImg: defaultImg,
        //     displayName: "SGDEV"
        // })
        // setFormRegister(prestate => ({
        //     ...prestate,
        //     userId: "U0ce66a9d268b3f1d81d04b30631acc87"
        // }))
        // InitailizeLiff()
    }, [])

    return (
        <>
            <Card>
                <Box sx={{ py: 3, px: 3, }}>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <img src={imgBanner} alt="ร้านยาชุมชนอบอุ่น" />
                    </Stack>
                    {API_URL}
                    {!isRegister && (
                        <>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <strong>
                                    กรอกข้อมูลเพื่อยืนยันการลงทะเบียน
                                </strong>
                            </Stack>
                            <Snackbar
                                open={open}
                                autoHideDuration={6000}
                                onClose={handleClose}
                            >
                                <Alert onClose={handleClose} severity={notifyMessage.type === "success" ? `${notifyMessage.type}` : "warning"} sx={{ width: '100%' }}>
                                    {notifyMessage.text}
                                </Alert>
                            </Snackbar>
                            <Box
                                component='form'
                                noValidate
                                autoComplete='off'
                                onSubmit={onSubmitHandler}
                                sx={{ py: 2, px: 2 }}
                            >
                                <Stack spacing={2}>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">ชื่อร้านยา</FormLabel>
                                        <Autocomplete
                                            fullWidth
                                            id="department"
                                            options={department}
                                            isOptionEqualToValue={(option, value) => option.depcode === formRegister.depcode}
                                            getOptionLabel={(option) => option.department}
                                            onChange={(event, newValue) => {
                                                if (newValue !== null) {
                                                    const { depcode, department } = newValue
                                                    setFormRegister(prestate => ({
                                                        ...prestate,
                                                        depcode: depcode,
                                                        department: department,
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} label="ค้นหาร้านยา" />}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <FormLabel component="legend" id="pharm_name">ชื่อ - สกุล</FormLabel>
                                        <TextField type="text"
                                            value={`${formRegister.pharm_name}`}
                                            id="pharm_name"
                                            name="pharm_name"
                                            placeholder='ระบุชื่อ - สกุล'
                                            onChange={handleChangeInput}
                                        />
                                    </FormControl>
                                    <Button variant="contained" type="submit">
                                        ลงทะเบียน
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}
                    {isRegister && (
                        <div className='mb-5'>
                            <Divider />
                            {displayData.length > 0 && displayData.map((row) => {
                                const { userId, department, pharm_name, created_date } = row
                                return (
                                    <div key={userId}>
                                        <Typography variant='h6' sx={{ color: 'common.dark', fontWeight: 500 }}>
                                            {department}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" padding={2}>
                                            <div>
                                                <Avatar
                                                    alt="Profile"
                                                    src={profileLine.avatarImg}
                                                    sx={{ width: 56, height: 56 }}
                                                />
                                                <small style={{ paddingLeft: "5px", fontWeight: 600 }}>{`${pharm_name} (${profileLine.displayName})`}</small>

                                            </div>
                                        </Stack>
                                        <div className='text-center'>
                                            <Typography variant='h5' sx={{ color: 'success.main', fontWeight: 500 }}>
                                                <div className='typography-icon'>
                                                    <CheckCircleOutlineIcon /> ลงทะเบียนแล้ว
                                                </div>
                                            </Typography>
                                            <small className='typography-icon' style={{ paddingLeft: "15px" }}>
                                                {`เมื่อ ${dayjs(created_date !== '' ? created_date : new Date()).format('DD MMM YYYY, HH:mm น.')}`}
                                            </small>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <Box sx={{ py: 3, px: 2, mt: 5 }}>
                        <small >โรงพยาบาลร้อยเอ็ด | Roiet Hospital <br /> โทร. 043 518 200</small>
                    </Box>
                </Box>
            </Card >
            {/* <Dialog
                open={Boolean(isNotify)}
                onClose={handleNotifyClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={isNotify}
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title" sx={{ bgcolor: `${notifyMessage.type}.main`, color: "common.white" }}>
                    <NotificationsIcon /> {notifyMessage.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ py: 2, fontWeight: "400", color: "#000" }}>
                        {notifyMessage.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNotifyClose} sx={{ color: redColor }}> <CloseIcon /> ปิด</Button>
                </DialogActions>
            </Dialog> */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" /> &nbsp;<Typography variant='body1'>Loading...</Typography>
            </Backdrop>
        </>
    )
}

const Styles = {
    notifyPrimary: { bgcolor: "primary.dark", color: "common.white" },
    notifySuccess: { bgcolor: "success.dark", color: "common.white" },
    notifyDanger: { bgcolor: "danger.dark", color: "common.white" },
    notifyWarning: { bgcolor: "warning.dark", color: "common.white" },
}

export default RegisterPage