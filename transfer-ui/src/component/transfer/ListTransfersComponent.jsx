import React, {Component} from 'react'
import ApiService from "../../service/ApiService";
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
import {TableRow} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const StyledTableCell = withStyles(theme => ({
    head: {
        color: theme.palette.common.black,
        backgroundColor: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

class ListTransfersComponent extends Component {

    interval = null;

    constructor(props) {
        super(props)
        this.state = {
            transfers: [],
            message: null
        }
        this.cancelTransfer = this.cancelTransfer.bind(this);
        this.executeTransfer = this.executeTransfer.bind(this);
        this.createTransfer = this.createTransfer.bind(this);
        this.reloadTransferList = this.reloadTransferList.bind(this);
    }

    componentDidMount() {
        //this.interval = setInterval(this.reloadTransferList, 10000);
        this.reloadTransferList();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    reloadTransferList() {
        ApiService.fetchTransfers()
            .then((res) => {
                this.setState({transfers: res.data});
            });
    }

    cancelTransfer(id) {
        ApiService.cancelTransfer(id)
            .then(res => {
                this.reloadTransferList();
                this.setState({message: 'Transfer cancelled successfully.'});
            });
    }

    executeTransfer(id) {
        ApiService.executeTransfer(id)
            .then(res => {
                this.reloadTransferList();
                this.setState({message: 'Transfer completed successfully.'});
            });
    }

    createTransfer() {
        window.localStorage.removeItem("id");
        this.props.history.push('/create-transfer');
    }

    render() {
        return (
            <div>
                <Typography variant="h5" style={style}>Transfers history</Typography>
                <Button variant="contained" color="primary" onClick={() => this.createTransfer()}> New transfer</Button>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tx Id</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell align={"right"}>Amount</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.transfers && this.state.transfers.map(
                                transfer =>
                                    <StyledTableRow key={transfer.id}>
                                        <TableCell variant={"head"} align="left" component="th" scope="row">
                                            {transfer.id}
                                        </TableCell>
                                        <TableCell variant={"head"} align="left">{transfer.source}</TableCell>
                                        <TableCell variant={"head"} align="left">{transfer.destination}</TableCell>
                                        <TableCell variant={"head"} align="right">{transfer.amount}</TableCell>
                                        <TableCell variant={"head"}>{transfer.currency}</TableCell>
                                        <TableCell variant={"head"} align="left">{transfer.title}</TableCell>
                                        <TableCell variant={"head"} align="left">{transfer.timestamp}</TableCell>
                                        <TableCell variant={"head"} align="left">{transfer.status}</TableCell>
                                        <TableCell variant={"head"} align="right">
                                            <Button size="small" disabled={transfer.status !== "PENDING"}
                                                    variant="contained" color="primary"
                                                    onClick={() => this.executeTransfer(transfer.id)}>Execute</Button>
                                        </TableCell>
                                        <TableCell variant={"head"} align="right">
                                            <Button size="small" disabled={transfer.status !== "PENDING"}
                                                    variant="contained" color="secondary"
                                                    onClick={() => this.cancelTransfer(transfer.id)}>Cancel</Button>
                                        </TableCell>
                                    </StyledTableRow>
                            )
                        }
                    </TableBody>
                </Table>

            </div>
        );
    }

}

const style = {
    display: 'flex',
    justifyContent: 'left'
}

export default ListTransfersComponent;