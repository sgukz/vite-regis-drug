import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

import Checkbox from '@mui/material/Checkbox';
import { red, green, grey } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';

import axios from 'axios'

import dayjs from 'dayjs';
import 'dayjs/locale/th'
dayjs.locale('th')

const redColor = red[900];
const greenColor = green[900];
const greyColor = grey[400];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const theme = createTheme({
    components: {
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    h1: 'h2',
                    h2: 'h2',
                    h3: 'h2',
                    h4: 'h2',
                    h5: 'h2',
                    h6: 'h2',
                    subtitle1: 'h2',
                    subtitle2: 'h2',
                    body1: 'span',
                    body2: 'span',
                },
            },
        },
    },
});


const dateNow = dayjs(new Date().toLocaleString()).format('YYYY-MM-DD HH:mm')
const API_URL = import.meta.env.VITE_API_URL
const API_TOKEN: string = import.meta.env.VITE_API_TOKEN

const HomePage = () => {
    const [isOpenForm, setIsOpenForm] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedID, setSelectedID] = useState(null);

    const [dateAccept, setDateAccept] = useState(dayjs(dateNow));
    const [dateExpire, setDateExpire] = useState(dayjs(dateNow));

    const [checkNotifyRound, setCheckNotifyRound] = useState({
        round1: {
            checked: false,
            value: ""
        },
        round2: {
            checked: false,
            value: ""
        }
    })

    const [formRegister, setFormRegister] = useState<{
        id?: number,
        data_list: string,
        set_expire: number,
        set_notify: number,
        set_notify_day: number,
        set_notify_round: string,
        expire_date: string,
        notify_date: string,
        created_date: string,
        modify_date: string,
        is_active: number,
        date_accept_list: string
    }>({
        data_list: '',
        set_expire: 0,
        set_notify: 0,
        set_notify_day: 0,
        set_notify_round: "",
        expire_date: dateNow,
        notify_date: '',
        created_date: '',
        modify_date: '',
        is_active: 1,
        date_accept_list: ''
    })



    const [errorMessage, setErrorMessage] = useState({
        data_list: {
            error: false,
            message: "โปรดระบุ รายการ"
        },
        date_accept_list: {
            error: false,
            message: "โปรดระบุ วันเวลาที่รับของ"
        }
    })

    const [isNotify, setIsNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState({
        type: "",
        title: "",
        text: ""
    })

    const [dataStore, setDataStore] = useState<{
        id: number,
        data_list: string,
        set_expire: number,
        set_notify: number,
        set_notify_day: number,
        set_notify_round: string,
        expire_date: string,
        notify_date: string,
        created_date: string,
        modify_date: string,
        is_active: number,
        date_accept_list: string
    }[]>([]);

    const handleClickOpenForm = () => {
        setIsOpenForm(true);
    };

    const handleCloseDelete = () => {
        setIsOpenDelete(!true);
    };

    const handleCloseForm = () => {
        setIsOpenForm(false);
        setFormRegister({
            data_list: '',
            set_expire: 0,
            set_notify: 0,
            set_notify_day: 0,
            set_notify_round: "",
            expire_date: dateNow,
            notify_date: '',
            created_date: '',
            modify_date: '',
            is_active: 1,
            date_accept_list: ''
        })
    };

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        const arr: string[] = [];
        if (checkNotifyRound.round1.value === "") {
            arr.splice(0, 1)
        } else {
            arr.push(checkNotifyRound.round1.value)

        }
        if (checkNotifyRound.round2.value === "") {
            arr.splice(1, 1)
        } else {
            arr.push(checkNotifyRound.round2.value)
        }
        formRegister.set_notify_round = arr.join()

        let newValueRule = { ...errorMessage }

        if (formRegister.data_list === "") {
            const name = "data_list"
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    error: true
                }
            }
        }
        if (formRegister.date_accept_list === "") {
            const name = "date_accept_list"
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    error: true
                }
            }
        }

        setErrorMessage(newValueRule)
        const chkError = Object.keys(newValueRule)
        let isValid = 0
        for (let index = 0; index < chkError.length; index++) {
            const currentErrorField = chkError[index];
            const currentErrorValue = newValueRule[currentErrorField as keyof typeof newValueRule];
            if (currentErrorValue.error) {
                isValid += 1
            }
        }

        if (isValid === 0) {
            axios.post(`${API_URL}/reh/createDataStore`, formRegister, {
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
                        setIsNotify(true)
                        handleCloseForm()
                        loadData()
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        event.preventDefault()
    }

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        let newValueRule = { ...errorMessage }
        if (value !== "") {
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    error: false
                }
            }
        } else {
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    error: true
                }
            }
        }
        setErrorMessage(newValueRule)
        setFormRegister(prestate => ({
            ...prestate,
            [name]: value
        }))
    }

    const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setFormRegister(prestate => ({
            ...prestate,
            [name]: checked ? 1 : 0
        }))
    }

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target
        let newValueRule = { ...checkNotifyRound }

        if (checked) {
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    checked: true,
                    value: value
                }
            }
        } else {
            newValueRule = {
                ...newValueRule,
                [name]: {
                    ...newValueRule[name as keyof typeof newValueRule],
                    checked: !true,
                    value: ""
                }
            }
        }

        setCheckNotifyRound(newValueRule)
    }

    const handleChangeNotify = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        let values = 0
        if (value !== null) {
            if (+value > 0 && +value < 1000) {
                values = +value
                const toDay = new Date(formRegister.expire_date)
                setTimeout(() => {
                    const notifyDate = dayjs(new Date(toDay.setDate(toDay.getDate() - +value))).format('YYYY-MM-DD')
                    setFormRegister(prestate => ({
                        ...prestate,
                        notify_date: notifyDate
                    }))
                }, 1000);
            } else {
                values = 0
            }
        } else {
            values = 0
        }

        setFormRegister(prestate => ({
            ...prestate,
            [name]: values
        }))
    }

    const handleNotifyClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsNotify(!true)
        setIsOpenForm(false)
        setNotifyMessage({
            type: "",
            title: "",
            text: ""
        })
        setFormRegister({
            data_list: '',
            set_expire: 0,
            set_notify: 0,
            set_notify_day: 0,
            set_notify_round: "",
            expire_date: dateNow,
            notify_date: '',
            created_date: '',
            modify_date: '',
            is_active: 1,
            date_accept_list: ''
        })
        e.preventDefault();
    }

    const handleOpenDelete = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
        setIsOpenDelete(true)
        setSelectedID(id)
        event.preventDefault();
    };

    const handleConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        axios.delete(`${API_URL}/reh/deleteDataStore/${selectedID}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": `Bearer ${API_TOKEN}`
            },
        })
            .then(function (response) {
                const { status } = response
                if (status === 200) {
                    setNotifyMessage({
                        type: "success",
                        title: "แจ้งเตือน",
                        text: "ลบข้อมูลสำเร็จ"
                    })
                    setIsNotify(true)
                    setIsOpenDelete(!true)
                    loadData()
                } else {
                    setNotifyMessage({
                        type: "danger",
                        title: "แจ้งเตือน",
                        text: `เกิดข้อผิดพลาด`
                    })
                    setIsNotify(true)
                    setIsOpenDelete(!true)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        event.preventDefault();
    };

    const handleOpenEdit = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
        setIsOpenForm(true)
        setSelectedID(id)
        const data = dataStore.filter(val => val.id === id)
        data.map((val) => {
            setDateAccept(dayjs(val.date_accept_list !== null ? val.date_accept_list : dateNow));
            setDateExpire(dayjs(val.expire_date));
            setFormRegister(val)
            const notify_round = val.set_notify_round.split(",")
            if (notify_round.length > 0) {
                let newValueRule = { ...checkNotifyRound }
                notify_round.map(val => {
                    if (val === "10:00:00") {
                        newValueRule = {
                            ...newValueRule,
                            round1: {
                                ...newValueRule["round1"],
                                checked: true,
                                value: val
                            }
                        }
                    } else if (val === "12:00:00") {
                        newValueRule = {
                            ...newValueRule,
                            round2: {
                                ...newValueRule["round2"],
                                checked: true,
                                value: val
                            }
                        }
                    }
                })
                setCheckNotifyRound(newValueRule)
            }


        })
        event.preventDefault();
    };

    const loadData = () => {
        axios.get(`${API_URL}/reh/getDataStoreAll`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": `Bearer ${API_TOKEN}`
            },
        })
            .then(function (response) {
                const { status } = response
                if (status === 200) {
                    setDataStore(response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        loadData()
    }, [])


    return (
        <>
            <ThemeProvider theme={theme}>
                <Card>
                    <Box sx={{ py: 3, px: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant='h5'>
                                รายการข้อมูลทั้งหมด
                            </Typography>
                            <Button onClick={handleClickOpenForm} variant="contained">
                                <AddIcon /> เพิ่มรายการใหม่
                            </Button>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>รายการ</StyledTableCell>
                                        <StyledTableCell align="center">วันที่หมดอายุ</StyledTableCell>
                                        <StyledTableCell align="center">วันที่แจ้งเตือน</StyledTableCell>
                                        <StyledTableCell align="center">แจ้งเตือนก่อนหมดอายุ (วัน)</StyledTableCell>
                                        <StyledTableCell align="center">สถานะการใช้งาน</StyledTableCell>
                                        <StyledTableCell align="center">จัดการ</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataStore.map((value) => {
                                        const { id, data_list, expire_date, notify_date, set_notify_day, is_active } = value
                                        return (
                                            <StyledTableRow key={id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {data_list}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{dayjs(expire_date).format('DD MMM YYYY')}</StyledTableCell>
                                                <StyledTableCell align="center">{dayjs(notify_date).format('DD MMM YYYY')}</StyledTableCell>
                                                <StyledTableCell align="center">{set_notify_day}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Typography variant="button" display="block" gutterBottom color={is_active === 1 ? greenColor : redColor}>
                                                        {is_active === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Stack direction="row" alignItems="center" justifyContent="center" >
                                                        <Tooltip title="แก้ไข" color='warning'>
                                                            <IconButton onClick={(e) => handleOpenEdit(e, id)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="ลบ" color='error'>
                                                            <IconButton onClick={(e) => handleOpenDelete(e, id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>

                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Card>
                <Dialog
                    open={Boolean(isOpenForm)}
                    onClose={handleCloseForm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={Boolean(isOpenForm)}
                    maxWidth={'sm'}
                >
                    <DialogTitle id="alert-dialog-title" sx={formRegister.id !== undefined ? Styles.notifyWarning : Styles.notifyPrimary}>
                        {`${formRegister.id !== undefined ? `แก้ไขรายการแจ้งเตือน` : "เพิ่มรายการแจ้งเตือน"}`}
                    </DialogTitle>
                    <Box
                        component='form'
                        noValidate
                        autoComplete='off'
                        onSubmit={onSubmitHandler}
                        sx={{ py: 2, px: 2 }}
                    >
                        <DialogContent tabIndex={-1}>
                            <Stack spacing={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <FormControl fullWidth error={errorMessage.data_list.error}>
                                        <FormLabel component="legend" id="data_list">รายการ <Typography color={redColor}>*</Typography></FormLabel>
                                        <TextField type="text"
                                            value={`${formRegister.data_list}`}
                                            id="data_list"
                                            name="data_list"
                                            placeholder='รายการ'
                                            onChange={handleChangeInput}
                                            error={errorMessage.data_list.error}
                                            helperText={errorMessage.data_list.error && errorMessage.data_list.message}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth error={errorMessage.date_accept_list.error}>
                                        <FormLabel component="legend" id="date_accept_list">วันเวลาที่รับของ <Typography variant='body2' color={redColor}>*</Typography></FormLabel>
                                        {JSON.stringify(dateExpire)}
                                        <DateTimeField
                                            label="รูปแบบ วัน/เดือน/ปี ค.ศ. ชม.:นาที เช่น (10/08/23 12:00)"
                                            value={dateAccept}
                                            onChange={(event) => {
                                                const values = event
                                                const dateValue = dayjs(values).format('YYYY-MM-DD HH:mm:ss')
                                                setFormRegister(prestate => ({
                                                    ...prestate,
                                                    date_accept_list: dateValue
                                                }))
                                                setDateAccept(dayjs(dateValue))
                                            }}
                                            format="DD/MM/YY HH:mm น."
                                        />
                                    </FormControl>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">ตั้งค่ากำหนดวันหมดอายุ</FormLabel>
                                        <FormGroup>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography style={{ color: formRegister.set_expire === 0 ? redColor : greyColor }}>ปิดการตั้งค่า</Typography>
                                                <Switch
                                                    checked={formRegister.set_expire === 1 ? true : false}
                                                    onChange={handleChangeChecked}
                                                    name="set_expire"
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <Typography style={{ color: formRegister.set_expire === 1 ? greenColor : greyColor }}>เปิดการตั้งค่า</Typography>
                                            </Stack>
                                        </FormGroup>
                                    </FormControl>
                                    {formRegister.set_expire === 1 && (
                                        <>
                                            <FormControl component="fieldset" variant="standard">
                                                <FormLabel component="legend">วันหมดอายุ</FormLabel>
                                                <DatePicker
                                                    label="เลือกวันหมดอายุ"
                                                    value={dateExpire}
                                                    onChange={(event) => {
                                                        const values = event
                                                        const dateValue = dayjs(values).format('YYYY-MM-DD')
                                                        setFormRegister(prestate => ({
                                                            ...prestate,
                                                            expire_date: dateValue
                                                        }))
                                                        setDateExpire(dayjs(dateValue))
                                                        if (formRegister.set_notify === 1 && formRegister.set_notify_day !== 0) {
                                                            const toDay = new Date(dateValue)
                                                            const notifyDate = dayjs(new Date(toDay.setDate(toDay.getDate() - +formRegister.set_notify_day))).format('YYYY-MM-DD')
                                                            setFormRegister(prestate => ({
                                                                ...prestate,
                                                                notify_date: notifyDate
                                                            }))
                                                        }
                                                    }}
                                                    format={'DD MMMM YYYY'}
                                                />
                                            </FormControl>
                                        </>)}
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">กำหนดการแจ้งเตือน</FormLabel>
                                        <FormGroup>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography style={{ color: formRegister.set_notify === 0 ? redColor : greyColor }}>ปิดการแจ้งเตือน</Typography>
                                                <Switch
                                                    checked={formRegister.set_notify === 1 ? true : false}
                                                    onChange={handleChangeChecked}
                                                    name="set_notify"
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <Typography style={{ color: formRegister.set_notify === 1 ? greenColor : greyColor }}>เปิดการแจ้งเตือน</Typography>
                                            </Stack>
                                        </FormGroup>
                                    </FormControl>
                                    {formRegister.set_notify === 1 && (
                                        <>
                                            {formRegister.set_notify_day !== 0 && (
                                                <>
                                                    <span>
                                                        วันที่แจ้งเตือน {dayjs(formRegister.notify_date).format('DD MMMM YYYY')}
                                                    </span>
                                                </>
                                            )}
                                            <FormControl>
                                                <FormLabel component="legend" id="set_notify_day">จำนวนวันที่ต้องแจ้งเตือนก่อนหมดอายุ (วัน)</FormLabel>
                                                <TextField type="number"
                                                    value={`${formRegister.set_notify_day}`}
                                                    id="set_notify_day"
                                                    name="set_notify_day"
                                                    placeholder='ระบุจำนวนวันที่แจ้งเตือน'
                                                    onChange={handleChangeNotify}
                                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                />

                                            </FormControl>
                                            <FormControl>
                                                <FormLabel component="legend" id="set_notify_round">ช่วงเวลาที่จะแจ้งเตือน</FormLabel>
                                                <FormGroup>
                                                    <FormControlLabel control={<Checkbox checked={checkNotifyRound.round1.checked} onChange={handleChangeCheckBox} name="round1" value={'10:00:00'} />} label="10.00 น." />
                                                    <FormControlLabel control={<Checkbox checked={checkNotifyRound.round2.checked} onChange={handleChangeCheckBox} name="round2" value={'12:00:00'} />} label="12.00 น." />
                                                </FormGroup>

                                            </FormControl>
                                        </>
                                    )}
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">สถานะการใช้งาน</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={formRegister.is_active === 1 ? true : false} onChange={handleChangeChecked} name="is_active" />
                                                }
                                                label={`${formRegister.is_active === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน"}`}
                                                style={{ color: formRegister.is_active === 1 ? greenColor : redColor }}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </LocalizationProvider>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" size="small" type='submit'>บันทึก</Button>
                            <Button variant="contained" color="error" size="small" onClick={handleCloseForm}>ปิด</Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                <Dialog
                    open={Boolean(isNotify)}
                    onClose={handleNotifyClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={isNotify}
                    maxWidth={'sm'}
                >
                    <DialogTitle id="alert-dialog-title" sx={{ bgcolor: `${notifyMessage.type}.dark`, color: "common.white" }}>
                        <NotificationsIcon /> {notifyMessage.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ py: 2 }}>
                            {notifyMessage.text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleNotifyClose} sx={{ color: redColor }}> <CloseIcon /> ปิด</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={Boolean(isOpenDelete)}
                    onClose={handleCloseDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth={'sm'}
                    fullWidth={Boolean(isOpenDelete)}
                >
                    <DialogTitle id="alert-dialog-title" sx={Styles.notifyPrimary}>
                        <NotificationsIcon fontSize='large' /> แจ้งเตือนจากระบบ
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ pt: 3 }}>
                            ต้องการลบข้อมูลใช่หรือไม่?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmDelete} autoFocus sx={{ color: redColor }}>
                            <DeleteIcon fontSize={'small'} color={'error'} /> ยืนยันการลบ</Button>
                        <Button onClick={handleCloseDelete}>
                            <CloseIcon /> ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </>
    )
}

const Styles = {
    notifyPrimary: { bgcolor: "primary.dark", color: "common.white" },
    notifySuccess: { bgcolor: "success.dark", color: "common.white" },
    notifyDanger: { bgcolor: "danger.dark", color: "common.white" },
    notifyWarning: { bgcolor: "warning.dark", color: "common.white" },
}

export default HomePage