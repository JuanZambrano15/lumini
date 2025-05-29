import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthError,
    User, // Importa el tipo User
    } from 'firebase/auth';
    import { doc, setDoc, getDoc } from 'firebase/firestore'; // Para Firestore
    import { auth, db } from './firebase'; // Asegúrate de que esta ruta sea correcta

    interface UserData {
    email: string;
    // Puedes añadir más campos aquí, como nombre, rol, etc.
    name?: string;
    parentPassword?: string;
}

    // --- Funciones de Autenticación ---

    export const registerUser = async (email: string, password: string, name?: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Obtienes el objeto User

        // ¡MUY IMPORTANTE! Verifica que user.uid no sea null/undefined aquí
        if (user && user.uid) { // Agregamos user && para asegurar que el objeto user no es null
        const userData: UserData = { email: email };
        if (name) {
            userData.name = name;
        }

        console.log('User UID before setDoc:', user.uid); // Debugging: ¡Añade esto!
        console.log('UserData before setDoc:', userData); // Debugging: ¡Añade esto!

        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('Datos de usuario guardados en Firestore exitosamente.');
        return user;
        } else {
        console.error('Error: user or user.uid is null after registration.');
        throw new Error('User UID is null or undefined after registration.');
        }

    } catch (error: any) {
        console.error('Error during registration (authService):', error);
        throw error; // Vuelve a lanzar el error para que sea capturado en la página de registro
    }
};
    export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Usuario inició sesión:', user.email);
        return user;
    } catch (error) {
        const firebaseError = error as AuthError;
        console.error('Error al iniciar sesión:', firebaseError.code, firebaseError.message);
        throw firebaseError;
    }
    };

    export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log('Usuario cerró sesión');
    } catch (error) {
        const firebaseError = error as AuthError;
        console.error('Error al cerrar sesión:', firebaseError.code, firebaseError.message);
        throw firebaseError;
    }
    };

    // --- Funciones de Datos de Usuario (Firestore) ---

    export const getUserData = async (userId: string): Promise<UserData | null> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
        } else {
        console.log('No such user data document!');
        return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
    
};
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'; // Nuevos imports para Firestore
const parentsCollection = collection(db, 'parents');
// Define la interfaz para los datos de un niño
export interface ChildProfile {
    id?: string; // El ID del documento de Firestore
    name: string;
    avatarUrl?: string; // URL de la imagen del avatar
    sexo: 'hombre' | 'mujer' | 'prefiero no decirlo'; // Campo de sexo
    tipoLimitacion: 'tdha'; // Por ahora, solo TDHA
    // Puedes añadir más campos aquí, como edad, género, progreso, etc.
    age?: number;
    avatarId?: number;
    }

    // --- Funciones para Perfiles de Niños ---

    export const getUserChildren = async (userId: string): Promise<ChildProfile[]> => {
    try {
        const childrenCollectionRef = collection(db, 'users', userId, 'children');
        const querySnapshot = await getDocs(childrenCollectionRef);
        const children: ChildProfile[] = [];
        querySnapshot.forEach((doc) => {
            // Asegúrate de que los datos del documento coincidan con ChildProfile
            children.push({
                id: doc.id,
                name: doc.data().name,
                avatarUrl: doc.data().avatarUrl,
                // ... otras propiedades si las tienes en Firestore
            } as ChildProfile); // 'as ChildProfile' para asegurar el tipo
        });
        return children;
    } catch (error) {
        console.error("Error al obtener los perfiles de los niños:", error);
        return []; // Retorna un array vacío en caso de error
    }
};
    export const createChildProfile = async (
    userId: string,
    profileData: Omit<ChildProfile, 'id' | 'parentId'> // Omit parentId si lo añades automáticamente
): Promise<ChildProfile> => {
    try {
        const parentDocRef = doc(parentsCollection, userId);
        const childrenCollectionRef = collection(parentDocRef, 'children');

        const finalProfileData = {
            ...profileData,
            parentId: userId, // Asegúrate de que parentId se agregue al objeto
            avatarId: profileData.avatarId || 1, // Fallback para avatarId
        };

        const newChildDocRef = doc(childrenCollectionRef);
        await setDoc(newChildDocRef, finalProfileData);

        return { id: newChildDocRef.id, ...finalProfileData }; // <<-- Devolver el perfil completo con ID
    } catch (error) {
        console.error("Error creating child profile:", error);
        throw error;
    }
};

    export const getChildrenProfiles = async (userId: string): Promise<ChildProfile[]> => {
    try {
        const childrenCollectionRef = collection(db, 'users', userId, 'children');
        const q = query(childrenCollectionRef);

        const querySnapshot = await getDocs(q);
        const profiles: ChildProfile[] = [];
        querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() } as ChildProfile);
        });
        console.log(`Perfiles de niños obtenidos para ${userId}:`, profiles);
        return profiles;
    } catch (error) {
        console.error('Error getting children profiles:', error);
        return [];
    }
};

    // Opcional: Actualizar un perfil de niño
    export const updateChildProfile = async (
    userId: string,
    childId: string,
    newData: Partial<ChildProfile>
    ): Promise<void> => {
    try {
        const childDocRef = doc(db, 'users', userId, 'children', childId);
        await updateDoc(childDocRef, newData);
        console.log(`Perfil de niño ${childId} actualizado.`);
    } catch (error) {
        console.error('Error updating child profile:', error);
        throw error;
    }
    };

    // Opcional: Eliminar un perfil de niño
    export const deleteChildProfile = async (userId: string, childId: string): Promise<void> => {
    try {
        const childDocRef = doc(db, 'users', userId, 'children', childId);
        await deleteDoc(childDocRef);
        console.log(`Perfil de niño ${childId} eliminado.`);
    } catch (error) {
        console.error('Error deleting child profile:', error);
        throw error;
    }
};
export const setParentAccessPassword = async (userId: string, password: string): Promise<void> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        // Aquí podrías hashear la contraseña antes de guardarla.
        // Por ahora, para la demo, la guardamos directamente.
        await updateDoc(userDocRef, { parentPassword: password });
        console.log(`Contraseña de acceso a padres establecida para el usuario ${userId}`);
    } catch (error) {
        console.error('Error al establecer la contraseña de acceso a padres:', error);
        throw error;
    }
};

/**
 * Verifica si la contraseña proporcionada coincide con la almacenada para el acceso a padres.
 * NOTA DE SEGURIDAD: En un entorno de producción, la verificación se haría contra un hash.
 */
export const verifyParentAccessPassword = async (userId: string, passwordAttempt: string): Promise<boolean> => {
    try {
        const userData = await getUserData(userId);
        if (userData && userData.parentPassword === passwordAttempt) {
            console.log(`Contraseña de acceso a padres verificada para el usuario ${userId}`);
            return true;
        }
        console.log(`Fallo al verificar la contraseña de acceso a padres para el usuario ${userId}`);
        return false;
    } catch (error) {
        console.error('Error al verificar la contraseña de acceso a padres:', error);
        return false;
    }
};
