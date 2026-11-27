import StageShell from '../../Components/Lesson/StageShell';
import CodeSandbox from '../../Components/Lesson/CodeSandbox';
import Materi, { PracticeIntro } from './Materi';
import lab from './lab';
import quiz from './quiz';

export default function ChapterFungsi({ lesson, code }) {
    return (
        <StageShell
            lesson={lesson}
            code={code}
            materi={<Materi />}
            practiceIntro={<PracticeIntro />}
            quiz={quiz}
            renderLab={(props) => <CodeSandbox lab={lab} {...props} />}
        />
    );
}
