import { Button, Container, Dialog, DialogContent, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import DangerousIcon from "@mui/icons-material/Dangerous";

const typeIcons = {
  success: <VerifiedIcon sx={{ fontSize: 100 }} color="success" />,
  error: <DangerousIcon sx={{ fontSize: 100 }} color="error" />,
  none: <></>,
};

const CustomDialog = (props) => {
  const {
    open,
    onClose = () => {},
    message = "",
    type = "none",
    yesorno = false,
    yesHandle = () => {},
    noHandle = () => {},
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Container>
          <Typography variant="h6" mb={2} textAlign={"center"}>
            {message}
          </Typography>
          <Typography align="center">{typeIcons[type]}</Typography>
          <Typography variant="div" mb={2} textAlign={"center"}>
            {yesorno && (
              <div>
                <Button variant="contained" color="primary" style={{ marginRight: 2 }} onClick={yesHandle}>
                  Si
                </Button>
                <Button variant="contained" color="secondary" style={{ marginLeft: 2 }} onClick={noHandle}>
                  No
                </Button>
              </div>
            )}
          </Typography>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
