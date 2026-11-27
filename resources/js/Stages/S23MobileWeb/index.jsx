import StageShell from '../../Components/Lesson/StageShell';
import DomLab from '../../Components/Lesson/DomLab';
import Materi, { PracticeIntro } from './Materi';
import lab from './lab';
import quiz from './quiz';

export default function ChapterMobileWeb({ lesson, code }) {
    return (
        <StageShell
            lesson={lesson}
            code={code}
            materi={<Materi />}
            practiceIntro={<PracticeIntro />}
            quiz={quiz}
            renderLab={(props) => <DomLab lab={lab} {...props} />}
        />
    );
}
