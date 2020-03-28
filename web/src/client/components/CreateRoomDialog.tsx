import * as React from "react"

import Dialog, { DialogHeader, DialogBody } from "./Dialog"
import FormControl from "./FormControl"
import TextField from "./TextField"

interface Props {}

const CreateRoomDialog: React.FC<Props> = ({}) => {
  const [handle, setHandle] = React.useState<string>("")

  return (
    <Dialog>
      <DialogHeader>Create room</DialogHeader>
      <DialogBody>
        <FormControl label="Handle">
          <TextField
            type="text"
            placeholder="Handle"
            defaultValue={handle}
            onChange={(event) => setHandle(event.target.value)}
          />
        </FormControl>
      </DialogBody>
    </Dialog>
  )
}

export default CreateRoomDialog
