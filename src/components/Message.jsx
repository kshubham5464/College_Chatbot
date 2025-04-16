import React, { memo } from 'react';

const Message = memo(({ sender, text }) => {
  return (
    <div className={`message ${sender}`}>
      {text}
    </div>
  );
});

Message.displayName = 'Message';

export default Message;